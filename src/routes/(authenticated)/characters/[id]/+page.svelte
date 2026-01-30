<script lang="ts">
  import type { PageData } from './$types.js'
  export let data: PageData
</script>

<div class="character-detail">
  <div class="header">
    <h2>{data.character.name}</h2>
    <a href="/characters" class="button">Back to Characters</a>
  </div>
  
  {#if data.character.image}
    <img src={data.character.image} alt={data.character.name} />
  {/if}
  
  {#if data.character.description}
    <p>{data.character.description}</p>
  {/if}
  
  <div class="stats">
    <div class="stat">
      <div class="stat-value">{data.character.totalGames}</div>
      <div class="stat-label">Total Games</div>
    </div>
    <div class="stat">
      <div class="stat-value">{data.character.wins}</div>
      <div class="stat-label">Wins</div>
    </div>
    <div class="stat">
      <div class="stat-value">{data.character.losses}</div>
      <div class="stat-label">Losses</div>
    </div>
  </div>
  
  <div class="section">
    <h3>Log Game</h3>
    <form method="POST">
      <div class="form-row">
        <div>
          <label>Result</label>
          <select name="won">
            <option value="true">Win</option>
            <option value="false">Loss</option>
          </select>
        </div>
        <div>
          <label>Opponent (optional)</label>
          <input type="text" name="opponent" />
        </div>
      </div>
      <div class="form-group">
        <label>Notes (optional)</label>
        <textarea name="note" rows="2"></textarea>
      </div>
      <button type="submit">Add Game</button>
    </form>
  </div>
  
  <div class="section">
    <h3>Game History</h3>
    {#if data.games.length === 0}
      <p>No games logged yet.</p>
    {:else}
      <div class="game-list">
        {#each data.games as game}
          <div class="game-item">
            <div class="game-result {game.won ? 'win' : 'loss'}">
              {game.won ? 'WIN' : 'LOSS'}
            </div>
            <div class="game-info">
              <div>Opponent: {game.opponent || 'N/A'}</div>
              <div class="game-date">{new Date(game.createdAt).toLocaleDateString()}</div>
            </div>
            {#if game.note}
              <div class="game-note">{game.note}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  h2, h3 {
    color: #ffffff;
    font-family: var(--pixel-font);
  }
  
  p {
    color: #ffffff;
    font-family: var(--pixel-font);
  }
  
  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    margin-bottom: 1.5rem;
    border: 4px solid #ffffff;
    background: #000000;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }
  
  .button {
    padding: 0.75rem 1.5rem;
    background: #000000;
    color: #ffffff;
    border: 3px solid #ffffff;
    font-family: var(--pixel-font);
    font-size: 1rem;
    text-decoration: none;
    text-transform: uppercase;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }
  
  .button:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }
  
  .stats {
    display: flex;
    gap: 2rem;
    margin: 2rem 0;
    padding: 1.5rem;
    background: #000000;
    border: 3px solid #ffffff;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }
  
  .stat {
    text-align: center;
    flex: 1;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #ffffff;
    font-family: var(--pixel-font);
  }
  
  .stat-label {
    color: #cccccc;
    font-size: 0.9rem;
    font-family: var(--pixel-font);
    margin-top: 0.5rem;
  }
  
  .section {
    margin-top: 3rem;
  }
  
  .section h3 {
    margin-bottom: 1rem;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .form-row > div {
    flex: 1;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ffffff;
    font-family: var(--pixel-font);
  }
  
  select, input[type="text"], textarea {
    width: 100%;
    padding: 0.75rem;
    border: 3px solid #ffffff;
    font-size: 1rem;
    background: #000000;
    color: #ffffff;
    font-family: var(--pixel-font);
  }
  
  select:focus, input:focus, textarea:focus {
    outline: none;
    background: #111111;
  }
  
  button[type="submit"] {
    background: #000000;
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    border: 3px solid #ffffff;
    font-size: 1rem;
    cursor: pointer;
    font-family: var(--pixel-font);
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }
  
  button[type="submit"]:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }
  
  .game-list {
    margin-top: 1rem;
  }
  
  .game-item {
    background: #000000;
    padding: 1rem;
    margin-bottom: 0.5rem;
    border: 3px solid #ffffff;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }
  
  .game-result {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-weight: bold;
    margin-right: 1rem;
    font-family: var(--pixel-font);
    border: 2px solid #ffffff;
  }
  
  .game-result.win {
    background: #000000;
    color: #ffffff;
  }
  
  .game-result.loss {
    background: #000000;
    color: #ffffff;
  }
  
  .game-info {
    display: inline-block;
    color: #ffffff;
    font-family: var(--pixel-font);
  }
  
  .game-date {
    font-size: 0.8rem;
    color: #cccccc;
    margin-top: 0.25rem;
  }
  
  .game-note {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed #cccccc;
    color: #cccccc;
    font-family: var(--pixel-font);
    font-size: 0.9rem;
  }
</style>
