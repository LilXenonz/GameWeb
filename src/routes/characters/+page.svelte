<script lang="ts">
  import type { PageData } from './$types.js'

  export let data: PageData
</script>

<h1>Characters</h1>

<a href="/characters/create">Create New Character</a>

<div class="characters">
  {#each data.characters as character}
    <div class="character">
      <h3>{character.name}</h3>
      {#if character.description}
        <p>{character.description}</p>
      {/if}
      
      <div class="stats">
        <div>Games: {character.totalGames}</div>
        <div>Wins: {character.wins}</div>
        <div>Losses: {character.losses}</div>
        <div>
          Win Rate: 
          {character.totalGames > 0 
            ? Math.round((character.wins / character.totalGames) * 100)
            : 0
          }%
        </div>
      </div>
      
      <a href="/characters/{character.id}">View Details</a>
    </div>
  {/each}
</div>

<style>
  .characters {
    display: grid;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .character {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 4px;
  }
  
  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin: 1rem 0;
  }
</style>