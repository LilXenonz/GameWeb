<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { enhance } from "$app/forms";
    import type { PageData } from "./$types";

    export let data: PageData;
    export let form: { error?: string };

    // Ensure reactivity when new data loads (e.g. after form submission)
    let messages = data.messages;
    $: messages = data.messages;

    let connectionStatus = "connecting";
    let eventSource: EventSource;
    let chatContainer: HTMLElement;
    let messageInput: HTMLInputElement;
    let typingUsers = new Set<string>();
    let isTyping = false;
    let typingTimeout: any;

    function scrollToBottom() {
        if (chatContainer) {
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 50);
        }
    }

    // Auto-scroll when messages update
    $: if (messages) {
        scrollToBottom();
    }

    async function handleInput() {
        if (!isTyping) {
            isTyping = true;
            await fetch("?/startTyping", {
                method: "POST",
                body: new FormData(),
            });
        }

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(async () => {
            isTyping = false;
            await fetch("?/stopTyping", {
                method: "POST",
                body: new FormData(),
            });
        }, 2000);
    }

    onMount(() => {
        scrollToBottom();

        // Initialize SSE connection
        eventSource = new EventSource("/api/chat-stream");

        eventSource.onopen = () => {
            connectionStatus = "connected";
        };

        eventSource.onmessage = (event) => {
            const eventData = JSON.parse(event.data);

            // Handle different event types
            switch (eventData.type) {
                case "new_message":
                    // Deduplicate logic to prevent double-rendering
                    if (!messages.some((m) => m.id === eventData.message.id)) {
                        messages = [...messages, eventData.message];
                    }
                    // Local logic: if user sent message, stop typing
                    if (eventData.message.user?.username) {
                        typingUsers.delete(eventData.message.user.username);
                        typingUsers = typingUsers;
                    }
                    break;

                case "user_typing":
                    if (eventData.username !== data.user?.username) {
                        if (eventData.isTyping) {
                            typingUsers.add(eventData.username);
                        } else {
                            typingUsers.delete(eventData.username);
                        }
                        typingUsers = typingUsers; // trigger Svelte reactivity
                    }
                    break;

                case "connected":
                    // Connection established
                    break;
            }
        };

        eventSource.onerror = (err) => {
            connectionStatus = "disconnected";
            if (eventSource.readyState === EventSource.CLOSED) {
                connectionStatus = "disconnected";
            } else {
                connectionStatus = "reconnecting";
            }
        };
    });

    onDestroy(() => {
        if (eventSource) {
            eventSource.close();
        }
    });
</script>

<div class="chat-wrapper">
    <div class="header">
        <h1>💬 Pixel Chat</h1>
        <div
            class="status-indicator"
            class:connected={connectionStatus === "connected"}
            class:reconnecting={connectionStatus === "reconnecting"}
        >
            <div class="led"></div>
            <span>{connectionStatus.toUpperCase()}</span>
        </div>
    </div>

    <div class="messages-container" bind:this={chatContainer}>
        {#if messages.length === 0}
            <div class="empty-state">
                <p>No messages yet. Start the conversation!</p>
            </div>
        {/if}

        {#each messages as msg}
            <div
                class="message-row"
                class:own-message={msg.user?.username === data.user?.username}
            >
                {#if msg.user?.username !== data.user?.username}
                    <div class="avatar">
                        {msg.user?.username.charAt(0).toUpperCase()}
                    </div>
                {/if}

                <div class="bubble">
                    <div class="sender">{msg.user?.username || "Unknown"}</div>
                    <div class="content">{msg.content}</div>
                    <div class="timestamp">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Typing Indicator -->
    <div class="typing-indicator" class:visible={typingUsers.size > 0}>
        {#if typingUsers.size > 0}
            <span>{Array.from(typingUsers).join(", ")} is typing...</span>
            <div class="dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        {/if}
    </div>

    <div class="input-area">
        {#if form?.error}
            <div class="error-banner">{form.error}</div>
        {/if}
        <form
            method="POST"
            action="?/sendMessage"
            use:enhance={({ cancel }) => {
                if (!messageInput.value.trim()) return cancel();

                // Optimistic UI updates
                const sentValue = messageInput.value;
                messageInput.value = "";
                isTyping = false;
                clearTimeout(typingTimeout);
                fetch("?/stopTyping", {
                    method: "POST",
                    body: new FormData(),
                }).catch(() => {});

                return async ({ result, update }) => {
                    if (result.type === "failure") {
                        messageInput.value = sentValue;
                    }
                    await update({ reset: false });
                };
            }}
        >
            <input
                type="text"
                name="message"
                placeholder="Type a message..."
                autocomplete="off"
                bind:this={messageInput}
                on:input={handleInput}
                required
            />
            <button type="submit">SEND ➤</button>
        </form>
    </div>
</div>

<style>
    .chat-wrapper {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 120px);
        max-width: 900px;
        margin: 0 auto;
        border: 4px solid #fff;
        box-shadow: 8px 8px 0 #000;
        background: #111;
        font-family: "Press Start 2P", monospace;
    }

    .header {
        background: #000;
        padding: 1rem;
        border-bottom: 4px solid #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h1 {
        font-size: 1.2rem;
        color: #ffd700;
        margin: 0;
        text-shadow: 2px 2px #ff0000;
    }

    .status-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.7rem;
        color: #f00;
    }

    .status-indicator.connected {
        color: #0f0;
    }
    .status-indicator.reconnecting {
        color: #ffa500;
    }

    .led {
        width: 10px;
        height: 10px;
        background-color: currentColor;
        box-shadow: 0 0 5px currentColor;
        animation: blink 2s infinite;
    }

    .status-indicator.connected .led {
        animation: none;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 0.2;
        }
        50% {
            opacity: 1;
        }
    }

    .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-image: linear-gradient(#222 1px, transparent 1px),
            linear-gradient(90deg, #222 1px, transparent 1px);
        background-size: 20px 20px;
    }

    .empty-state {
        text-align: center;
        color: #666;
        margin-top: 2rem;
    }

    .message-row {
        display: flex;
        gap: 0.8rem;
        align-items: flex-end;
        max-width: 80%;
    }

    .message-row.own-message {
        align-self: flex-end;
        flex-direction: row-reverse;
    }

    .avatar {
        width: 32px;
        height: 32px;
        background: #444;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #fff;
        font-size: 0.8rem;
        box-shadow: 2px 2px 0 #000;
    }

    .bubble {
        background: #fff;
        color: #000;
        padding: 0.8rem;
        position: relative;
        border: 2px solid #000;
        box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
        min-width: 100px;
    }

    .own-message .bubble {
        background: #0000aa;
        color: #fff;
        border: 2px solid #fff;
    }

    .sender {
        font-size: 0.6rem;
        margin-bottom: 0.4rem;
        opacity: 0.7;
        font-weight: bold;
    }

    .content {
        line-height: 1.4;
        word-break: break-word;
        font-family: monospace;
        font-size: 0.9rem;
        font-weight: bold;
    }

    .timestamp {
        font-size: 0.5rem;
        text-align: right;
        margin-top: 0.4rem;
        opacity: 0.6;
    }

    .typing-indicator {
        padding: 0.5rem 1rem;
        font-size: 0.7rem;
        color: #ffd700;
        min-height: 20px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #000;
        visibility: hidden;
    }

    .typing-indicator.visible {
        visibility: visible;
    }

    .dots {
        display: flex;
        gap: 2px;
    }
    .dot {
        width: 4px;
        height: 4px;
        background: #ffd700;
        animation: bounce 1s infinite;
    }
    .dot:nth-child(2) {
        animation-delay: 0.2s;
    }
    .dot:nth-child(3) {
        animation-delay: 0.4s;
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-4px);
        }
    }

    .input-area {
        padding: 1rem;
        background: #000;
        border-top: 4px solid #fff;
    }

    form {
        display: flex;
        gap: 1rem;
    }

    input {
        flex: 1;
        background: #222;
        border: 2px solid #fff;
        color: #fff;
        padding: 0.8rem;
        font-family: inherit;
        font-size: 0.8rem;
        outline: none;
    }

    input:focus {
        background: #333;
        border-color: #ffd700;
    }

    button {
        background: #00aa00;
        color: #fff;
        border: 2px solid #fff;
        padding: 0 1.5rem;
        font-family: inherit;
        cursor: pointer;
        text-transform: uppercase;
        box-shadow: 4px 4px 0 #000;
        transition: transform 0.1s;
    }

    button:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #000;
    }

    .messages-container::-webkit-scrollbar {
        width: 12px;
    }
    .messages-container::-webkit-scrollbar-track {
        background: #000;
    }
    .messages-container::-webkit-scrollbar-thumb {
        background: #fff;
        border: 2px solid #000;
    }

    .error-banner {
        color: #ff0000;
        background: #330000;
        border: 2px solid #ff0000;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.7rem;
        text-align: center;
    }
</style>
