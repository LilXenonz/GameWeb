<script lang="ts">
  import type { ActionData } from './$types.js'
  export let form: ActionData
  let isLogin = true
</script>

<div class="auth">
  <div class="auth-container">
    <h2>{isLogin ? 'Login' : 'Register'}</h2>

    {#if form?.error}
      <div class="error">{form.error}</div>
    {/if}

    <div class="toggle">
      <button on:click={() => isLogin = true} class:active={isLogin}>
        Login
      </button>
      <button on:click={() => isLogin = false} class:active={!isLogin}>
        Register
      </button>
    </div>

    {#if isLogin}
      <form method="POST" action="?/login">
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    {:else}
      <form method="POST" action="?/register">
        <div class="form-group">
          <label>Username (min 3 characters)</label>
          <input type="text" name="username" required />
        </div>
        <div class="form-group">
          <label>Password (min 3 characters)</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
    {/if}

    <a href="/" class="back">← Back</a>
  </div>
</div>

<style>
  .auth {
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  .auth-container {
    background: #000000;
    padding: 2rem;
    border-radius: 0;
    border: 4px solid #ffffff;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
    width: 100%;
    max-width: 400px;
  }

  h2 {
    margin-bottom: 1.5rem;
    text-align: center;
    font-family: var(--pixel-font);
    color: #ffffff;
  }

  .error {
    background: #000000;
    color: #ffffff;
    padding: 0.75rem;
    border: 2px solid #ffffff;
    border-radius: 0;
    margin-bottom: 1rem;
  }

  .toggle {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
    border: 3px solid #ffffff;
    border-radius: 0;
    overflow: hidden;
  }

  .toggle button {
    flex: 1;
    padding: 0.75rem;
    background: #000000;
    border: 0;
    cursor: pointer;
    font-family: var(--pixel-font);
    color: #ffffff;
    border-right: 3px solid #ffffff;
  }
  
  .toggle button:last-child {
    border-right: none;
  }

  .toggle button.active {
    background: #ffffff;
    color: #000000;
  }
  
  .toggle button:not(.active):hover {
    background: #222222;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
    color: #ffffff;
    font-family: var(--pixel-font);
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 3px solid #ffffff;
    border-radius: 0;
    font-size: 1rem;
    background: #000000;
    color: #ffffff;
    font-family: var(--pixel-font);
  }

  input:focus {
    outline: none;
    background: #111111;
  }

  button[type="submit"] {
    width: 100%;
    padding: 0.75rem;
    background: #000000;
    color: #ffffff;
    border: 3px solid #ffffff;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
    font-family: var(--pixel-font);
  }

  button[type="submit"]:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .back {
    display: block;
    text-align: center;
    margin-top: 1.5rem;
    color: #ffffff;
    text-decoration: none;
    font-family: var(--pixel-font);
  }

  .back:hover {
    text-decoration: underline;
  }
</style>
