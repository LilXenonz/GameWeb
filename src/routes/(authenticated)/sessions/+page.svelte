<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="container">
    <h1 class="title">Active Sessions</h1>
    <p class="subtitle">Manage your active devices and sessions.</p>

    <div class="sessions-list">
        {#each data.sessions as session}
            <div class="session-card pixel-card">
                <div class="session-header">
                    <div class="device-icon">
                        {#if session.deviceName
                            ?.toLowerCase()
                            .includes("mobile") || session.deviceName
                                ?.toLowerCase()
                                .includes("android") || session.deviceName
                                ?.toLowerCase()
                                .includes("ios")}
                            📱
                        {:else}
                            💻
                        {/if}
                    </div>
                    <div class="device-details">
                        <strong class="device-name"
                            >{session.deviceName || "Unknown Device"}</strong
                        >
                        <span class="user-agent">{session.userAgent}</span>
                    </div>
                    {#if session.id === data.currentSessionId}
                        <div class="current-badge">CURRENT</div>
                    {/if}
                </div>

                <div class="session-meta">
                    <div class="meta-item">
                        <span class="label">IP Address:</span>
                        <span class="value"
                            >{session.ipAddress || "Unknown"}</span
                        >
                    </div>
                    <div class="meta-item">
                        <span class="label">Created:</span>
                        <span class="value"
                            >{new Date(session.createdAt).toLocaleDateString()}
                            {new Date(
                                session.createdAt,
                            ).toLocaleTimeString()}</span
                        >
                    </div>
                    <div class="meta-item">
                        <span class="label">Last Active:</span>
                        <span class="value"
                            >{new Date(session.lastUsed).toLocaleDateString()}
                            {new Date(
                                session.lastUsed,
                            ).toLocaleTimeString()}</span
                        >
                    </div>
                </div>

                <div class="session-actions">
                    {#if session.id !== data.currentSessionId}
                        <form method="POST" action="?/revokeSession">
                            <input
                                type="hidden"
                                name="sessionId"
                                value={session.id}
                            />
                            <button type="submit" class="pixel-btn danger"
                                >Revoke Access</button
                            >
                        </form>
                    {:else}
                        <span class="active-text">This Device</span>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    <div class="global-actions">
        <form method="POST" action="?/revokeAllSessions">
            <button type="submit" class="pixel-btn danger large"
                >Log Out All Other Devices</button
            >
        </form>
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .title {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        text-shadow: 2px 2px 0 #333;
    }

    .subtitle {
        color: var(--color-text-muted);
        margin-bottom: 2rem;
        font-size: 0.8rem;
    }

    .sessions-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .session-card {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: relative;
        background: #111;
    }

    .session-header {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        border-bottom: 2px dashed #333;
        padding-bottom: 1rem;
    }

    .device-icon {
        font-size: 2rem;
    }

    .device-details {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .device-name {
        font-size: 1.2rem;
        color: var(--color-accent);
        margin-bottom: 0.3rem;
    }

    .user-agent {
        font-size: 0.6rem;
        color: #666;
        word-break: break-all;
        font-family: monospace;
    }

    .current-badge {
        background: var(--color-accent);
        color: #000;
        padding: 0.3rem 0.6rem;
        font-size: 0.7rem;
        font-weight: bold;
        border: 2px solid #fff;
    }

    .session-meta {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        font-size: 0.8rem;
    }

    .meta-item {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .label {
        color: #666;
        font-size: 0.7rem;
        text-transform: uppercase;
    }

    .session-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }

    .pixel-btn.danger {
        border-color: #ff3333;
        color: #ff3333;
        box-shadow: 0.2rem 0.2rem 0 #990000;
        font-size: 0.7rem;
    }

    .pixel-btn.danger:hover {
        background: #330000;
        transform: translate(0.1rem, 0.1rem);
        box-shadow: 0.1rem 0.1rem 0 #990000;
    }

    .active-text {
        color: var(--color-accent);
        font-size: 0.8rem;
        padding: 0.6rem;
    }

    .global-actions {
        margin-top: 3rem;
        border-top: 2px solid #333;
        padding-top: 2rem;
        text-align: center;
    }

    .pixel-btn.large {
        font-size: 1rem;
        padding: 1rem 2rem;
    }
</style>
