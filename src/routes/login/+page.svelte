<script lang="ts">
  import type { ActionData } from './$types.js';

  export let form: ActionData;
  let isLoading = false;
</script>

<h1>Logga In eller Registrera</h1>

{#if form?.error}
  <div style="color: red; margin-bottom: 1rem;">{form.error}</div>
{/if}

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
  <!-- Login Form -->
  <div>
    <h2>Logga In</h2>
    <form method="POST" action="?/login" on:submit={() => isLoading = true}>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem;">
          Användarnamn:
        </label>
        <input 
          type="text" 
          name="username" 
          required 
          style="width: 100%; padding: 0.5rem;"
        />
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem;">
          Lösenord:
        </label>
        <input 
          type="password" 
          name="password" 
          required 
          style="width: 100%; padding: 0.5rem;"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        style="padding: 0.5rem 1rem;"
      >
        {isLoading ? 'Loggar in...' : 'Logga In'}
      </button>
    </form>
  </div>

  <!-- Register Form -->
  <div>
    <h2>Registrera</h2>
    <form method="POST" action="?/register" on:submit={() => isLoading = true}>
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem;">
          Användarnamn:
        </label>
        <input 
          type="text" 
          name="username" 
          required 
          style="width: 100%; padding: 0.5rem;"
        />
      </div>
      
      <div style="margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem;">
          Lösenord:
        </label>
        <input 
          type="password" 
          name="password" 
          required 
          style="width: 100%; padding: 0.5rem;"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        style="padding: 0.5rem 1rem;"
      >
        {isLoading ? 'Registrerar...' : 'Registrera'}
      </button>
    </form>
  </div>
</div>

<a href="/" style="display: block; margin-top: 2rem;">← Tillbaka till startsidan</a>