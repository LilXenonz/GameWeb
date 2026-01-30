<script>
  export let data;
</script>

<div class="public-layout">
  <header class="public-header">
    <div class="header-content">
      <h1 class="logo">
        <span class="logo-icon">🎮</span>
        <span class="logo-text">Pixel Game Tracker</span>
      </h1>
      
      <nav class="public-nav">
        <a href="/" class="nav-link" class:active={data.currentPath === '/'}>
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Home</span>
        </a>
        <a href="/login" class="nav-link" class:active={data.currentPath === '/login'}>
          <span class="nav-icon">🔑</span>
          <span class="nav-text">Login</span>
        </a>
      </nav>
    </div>
  </header>

  <main class="public-main">
    <div class="container">
      <slot />
    </div>
  </main>

  <footer class="public-footer">
    <div class="footer-content">
      <p class="copyright">© 2024 Pixel Game Tracker. All rights reserved.</p>
      <p class="tagline">Level up your gaming experience! 🚀</p>
    </div>
  </footer>
</div>

<style>
  .public-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #000000;
  }

  .public-header {
    background: #000000;
    border-bottom: 3px solid #ffffff;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ffffff;
    font-size: 1.2rem;
    text-decoration: none;
    text-shadow: 0.1rem 0.1rem 0 #333333;
  }
  
  .logo-icon {
    font-size: 1.5rem;
  }

  .logo-text {
    font-family: var(--pixel-font);
  }

  .public-nav {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: #000000;
    border: 3px solid #ffffff;
    border-radius: 0;
    color: #ffffff;
    font-size: 1.1rem;
    /* INGA ANIMATIONER ELLER OVERGÅNGAR */
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
    cursor: pointer;
  }

  .nav-link:hover {
    background: #222222;
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
    transform: translate(0.1rem, 0.1rem);
  }

  .nav-link.active {
    background: #ffffff;
    color: #000000;
    border-color: #ffffff;
    box-shadow: 0.2rem 0.2rem 0 #888888;
  }

  .nav-icon {
    font-size: 1.2rem;
  }

  .public-main {
    flex: 1;
    padding: 2rem 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .public-footer {
    background: #000000;
    border-top: 3px solid #ffffff;
    padding: 2rem 0;
    margin-top: auto;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
  }

  .copyright {
    color: #cccccc;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    text-shadow: none;
  }

  .tagline {
    color: #ffffff;
    font-size: 1rem;
    text-shadow: none;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      text-align: center;
    }
    
    .public-nav {
      justify-content: center;
    }
    
    .nav-link {
      padding: 0.5rem 1rem;
    }
  }
</style>