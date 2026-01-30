<script lang="ts">
  import type { PageData } from './$types.js'
  export let data: PageData
</script>

<div class="pixel-characters">
  <div class="pixel-header-row">
    <h2 class="pixel-title">CHARACTERS</h2>
    <a href="/characters/create" class="pixel-btn">NEW CHARACTER</a>
  </div>

  {#if data.characters.length === 0}
    <div class="pixel-empty">
      <div class="pixel-empty-icon">👤</div>
      <p class="pixel-empty-text">NO CHARACTERS</p>
      <a href="/characters/create" class="pixel-btn">CREATE FIRST</a>
    </div>
  {:else}
    <div class="pixel-character-grid">
      {#each data.characters as character}
        <div class="pixel-character-card">
          <h3 class="pixel-character-name">{character.name}</h3>
          
          <div class="pixel-stats">
            <div class="pixel-stat">
              <span>GAMES</span>
              <strong>{character.totalGames}</strong>
            </div>
            <div class="pixel-stat">
              <span>WINS</span>
              <strong class="win">{character.wins}</strong>
            </div>
            <div class="pixel-stat">
              <span>LOSSES</span>
              <strong class="loss">{character.losses}</strong>
            </div>
          </div>
          
          <a href="/characters/{character.id}" class="pixel-view-btn">VIEW</a>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .pixel-characters {
    padding: 1rem 0;
  }

  .pixel-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #000000;
    border: 3px solid #ffffff;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .pixel-title {
    font-family: var(--pixel-font);
    font-size: 1.2rem;
    color: #ffffff;
  }

  .pixel-btn {
    padding: 0.75rem 1.5rem;
    background: #000000;
    color: #ffffff;
    border: 3px solid #ffffff;
    font-family: var(--pixel-font);
    font-size: 1.2rem;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .pixel-btn:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .pixel-empty {
    text-align: center;
    padding: 3rem;
    background: #000000;
    border: 3px solid #ffffff;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .pixel-empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .pixel-empty-text {
    font-size: 1.5rem;
    color: #ffffff;
    margin-bottom: 1.5rem;
  }

  .pixel-character-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .pixel-character-card {
    background: #000000;
    border: 3px solid #ffffff;
    padding: 1.5rem;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .pixel-character-name {
    font-family: var(--pixel-font);
    font-size: 1rem;
    color: #ffffff;
    margin-bottom: 1rem;
    border-bottom: 2px solid #ffffff;
    padding-bottom: 0.5rem;
  }

  .pixel-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #000000;
    border: 2px solid #ffffff;
  }

  .pixel-stat {
    text-align: center;
  }

  .pixel-stat span {
    display: block;
    font-size: 0.9rem;
    color: #cccccc;
    margin-bottom: 0.25rem;
  }

  .pixel-stat strong {
    font-size: 1.5rem;
    color: #ffffff;
  }

  .win {
    color: #ffffff;
  }

  .loss {
    color: #ffffff;
  }

  .pixel-view-btn {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background: #000000;
    color: #ffffff;
    border: 3px solid #ffffff;
    text-align: center;
    text-decoration: none;
    font-family: var(--pixel-font);
    font-size: 1.2rem;
    text-transform: uppercase;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .pixel-view-btn:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }
</style>
