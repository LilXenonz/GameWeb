<script lang="ts">
  import type { PageData } from './$types.js'

  export let data: PageData
  
  const winRate = data.character.totalGames > 0 
    ? Math.round((data.character.wins / data.character.totalGames) * 100)
    : 0
</script>

<h1>{data.character.name}</h1>

{#if data.character.description}
  <p>{data.character.description}</p>
{/if}

<div class="stats">
  <div>Total Games: {data.character.totalGames}</div>
  <div>Wins: {data.character.wins}</div>
  <div>Losses: {data.character.losses}</div>
  <div>Win Rate: {winRate}%</div>
</div>

<a href="/games/create?character={data.character.id}">Log New Match</a>

<h2>Match History</h2>

{#if data.character.games.length > 0}
  <div class="games">
    {#each data.character.games as game}
      <div class="game {game.won ? 'won' : 'lost'}">
        <span>{game.won ? 'WIN' : 'LOSS'}</span>
        {#if game.opponent}
          <span>vs {game.opponent}</span>
        {/if}
        <span>{new Date(game.createdAt).toLocaleDateString()}</span>
        {#if game.note}
          <span>"{game.note}"</span>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <p>No matches logged yet.</p>
{/if}

<a href="/characters">Back to Characters</a>

<style>
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  
  .games {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .game {
    padding: 0.5rem;
    border-radius: 4px;
    display: flex;
    gap: 1rem;
  }
  
  .game.won {
    background: #d4edda;
    border: 1px solid #c3e6cb;
  }
  
  .game.lost {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
  }
</style>