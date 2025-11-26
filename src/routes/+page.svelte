<script lang="ts">
  import type { LayoutData } from './$types.js';

  export let data: LayoutData;
</script>

<h1>Character Tracker</h1>

{#if data.user}
  <p>Välkommen tillbaka, {data.user.username}!</p>
  <a href="/characters" style="display: inline-block; padding: 0.5rem 1rem; background: #007acc; color: white; text-decoration: none; border-radius: 4px;">
    Visa Mina Karaktärer
  </a>
{:else}
  <p>Spåra dina spelkaraktärers prestationer och statistik</p>
  <a href="/login" style="display: inline-block; padding: 0.5rem 1rem; background: #007acc; color: white; text-decoration: none; border-radius: 4px;">
    Logga In för att Komma Igång
  </a>
{/if}