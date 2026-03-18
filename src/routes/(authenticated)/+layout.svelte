<script>
  export let data;
</script>

<div class="auth-layout">
  <header class="auth-header">
    <nav class="main-nav">
      <a href="/dashboard" class="nav-btn">📊 Dashboard</a>
      <a href="/characters" class="nav-btn">👤 Characters</a>
      <a href="/games/create" class="nav-btn">🎮 Games</a>
      <a href="/chat" class="nav-btn">💬 Chat</a>
    </nav>

    <div class="user-menu">
      <span class="welcome">Welcome, {data.user?.username}!</span>
      <form method="POST" action="/login?/logout">
        <button type="submit" class="logout-btn">🚪 Logout</button>
      </form>
    </div>
  </header>

  <div class="content-area">
    <aside class="sidebar">
      <div class="sidebar-content">
        <h3>Quick Stats</h3>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Characters:</span>
            <span class="stat-value">{data.stats?.characterCount || 0}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Games:</span>
            <span class="stat-value">{data.stats?.gameCount || 0}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Wins:</span>
            <span class="stat-value">{data.stats?.winCount || 0}</span>
          </div>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <slot />
    </main>
  </div>
</div>

<style>
  .auth-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .auth-header {
    background: #000000;
    padding: 1rem;
    border-bottom: 3px solid #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .main-nav {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nav-btn {
    font-family: var(--pixel-font);
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    background: #000000;
    color: #ffffff;
    border: 3px solid #ffffff;
    text-decoration: none;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .nav-btn:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .welcome {
    color: #ffffff;
    font-family: var(--pixel-font);
    font-size: 1.2rem;
  }

  .logout-btn {
    font-family: var(--pixel-font);
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
    background: #000000;
    color: #ffffff;
    border: 3px solid #ffffff;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .logout-btn:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .content-area {
    flex: 1;
    display: flex;
  }

  .sidebar {
    width: 250px;
    background: #000000;
    padding: 1rem;
    border-right: 3px solid #ffffff;
  }

  .sidebar-content h3 {
    color: #ffffff;
    font-family: var(--pixel-font);
    font-size: 0.8rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: #000000;
    border: 3px solid #ffffff;
  }

  .stat-label {
    color: #cccccc;
  }

  .stat-value {
    color: #ffffff;
    font-weight: bold;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    background-color: #000000;
  }
</style>
