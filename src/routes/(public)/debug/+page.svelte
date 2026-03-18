<script>
    export let data;
</script>

<div class="debug-page">
    <h1>🔍 Session Debug Page</h1>

    <div class="debug-section">
        <h2>Cookie Status</h2>
        <p>
            <strong>Session Token Present:</strong>
            {data.sessionToken ? "✅ Yes" : "❌ No"}
        </p>
        <p>
            <strong>User Authenticated:</strong>
            {data.hasUser ? "✅ Yes" : "❌ No"}
        </p>
        {#if data.user}
            <p><strong>Username:</strong> {data.user.username}</p>
            <p><strong>User ID:</strong> {data.user.id}</p>
        {/if}
        <p><strong>Cookie Header (Server-Side):</strong></p>
        <pre>{data.cookieHeader}</pre>
    </div>

    <div class="debug-section">
        <h2>Browser Cookies (Client-Side)</h2>
        <p><strong>All Cookies:</strong></p>
        <pre>{document.cookie ||
                "No cookies visible to JavaScript (this is expected for httpOnly cookies)"}</pre>
    </div>

    <div class="debug-section">
        <h2>Instructions</h2>
        <ol>
            <li>Open your browser's Developer Tools (F12)</li>
            <li>Go to the "Application" or "Storage" tab</li>
            <li>Look for "Cookies" → "http://localhost:5173"</li>
            <li>Check if there's a cookie named "sessionToken"</li>
            <li>If it exists, check its expiration date and attributes</li>
        </ol>
    </div>

    <div class="actions">
        <a href="/login" class="btn">Go to Login</a>
        <a href="/dashboard" class="btn">Go to Dashboard</a>
    </div>
</div>

<style>
    .debug-page {
        max-width: 800px;
        margin: 2rem auto;
        padding: 2rem;
        background: #000;
        color: #fff;
        font-family: var(--pixel-font, monospace);
        border: 3px solid #fff;
    }

    h1 {
        color: #fff;
        margin-bottom: 2rem;
        text-align: center;
    }

    h2 {
        color: #fff;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #fff;
        padding-bottom: 0.5rem;
    }

    .debug-section {
        margin-bottom: 2rem;
        padding: 1rem;
        background: #111;
        border: 2px solid #fff;
    }

    p {
        margin: 0.5rem 0;
    }

    pre {
        background: #222;
        padding: 1rem;
        border: 1px solid #fff;
        overflow-x: auto;
        color: #0f0;
    }

    ol {
        margin-left: 1.5rem;
    }

    li {
        margin: 0.5rem 0;
    }

    .actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        background: #000;
        color: #fff;
        border: 3px solid #fff;
        text-decoration: none;
        font-family: var(--pixel-font, monospace);
        cursor: pointer;
        box-shadow: 0.2rem 0.2rem 0 #fff;
    }

    .btn:hover {
        background: #222;
        transform: translate(0.1rem, 0.1rem);
        box-shadow: 0.1rem 0.1rem 0 #fff;
    }
</style>
