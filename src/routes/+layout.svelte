<script lang="ts">
  import type { LayoutData } from './$types.js';

  export let data: LayoutData;
</script>

<nav style="background: #333; padding: 1rem; margin-bottom: 2rem;">
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <a href="/" style="color: white; margin-right: 1rem; text-decoration: none;">Hem</a>
      {#if data.user}
        <a href="/characters" style="color: white; margin-right: 1rem; text-decoration: none;">Mina Karaktärer</a>
      {/if}
    </div>
    
    <div>
      {#if data.user}
        <span style="color: white; margin-right: 1rem;">Välkommen, {data.user.username}!</span>
        <form method="POST" action="/login?/logout" style="display: inline;">
          <button type="submit" style="padding: 0.25rem 0.5rem;">Logga ut</button>
        </form>
      {:else}
        <a href="/login" style="color: white; text-decoration: none;">Logga in</a>
      {/if}
    </div>
  </div>
</nav>

<main style="padding: 0 1rem;">
  <slot />
</main>