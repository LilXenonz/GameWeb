<script lang="ts">
  import { enhance } from '$app/forms'
  import type { PageData, ActionData } from './$types.js'

  export let data: PageData
  export let form: ActionData
  
  let message = ''
  let selectedCharacter = ''
  
  $: if (form?.message) {
    message = form.message
  }
</script>zz

<div class="pixel-log-match">
  <h1 class="pixel-title">LOG MATCH</h1>

  {#if message}
    <div class="pixel-message">{message}</div>
  {/if}

  <form method="POST" use:enhance class="pixel-form">
    <div class="pixel-form-group">
      <label class="pixel-label">
        CHARACTER *
      </label>
      <select name="characterId" required bind:value={selectedCharacter} class="pixel-select">
        <option value="">SELECT CHARACTER</option>
        {#each data.characters as character}
          <option value={character.id}>{character.name}</option>
        {/each}
      </select>
    </div>
    
    <div class="pixel-form-group">
      <label class="pixel-label">RESULT *</label>
      <div class="pixel-radio-group">
        <label class="pixel-radio">
          <input type="radio" name="won" value="true" required />
          <span class="radio-text">WIN</span>
        </label>
        <label class="pixel-radio">
          <input type="radio" name="won" value="false" />
          <span class="radio-text">LOSS</span>
        </label>
      </div>
    </div>
    
    <div class="pixel-form-group">
      <label class="pixel-label">
        OPPONENT
      </label>
      <input type="text" name="opponent" class="pixel-input" />
    </div>
    
    <div class="pixel-form-group">
      <label class="pixel-label">
        NOTE
      </label>
      <textarea name="note" class="pixel-textarea"></textarea>
    </div>
    
    <button type="submit" class="pixel-submit-btn">LOG MATCH</button>
  </form>

  <a href="/characters" class="pixel-back-btn">← BACK TO CHARACTERS</a>
</div>

<style>
  .pixel-log-match {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background: #000;
    border: 4px solid #fff;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .pixel-title {
    font-family: 'Press Start 2P', cursive;
    font-size: 1.5rem;
    color: #ffffff;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .pixel-message {
    background: #000000;
    color: #ffffff;
    padding: 1rem;
    border: 2px solid #ffffff;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    text-align: center;
  }

  .pixel-form {
    background: #000000;
    padding: 1.5rem;
    border: 3px solid #ffffff;
    margin-bottom: 1.5rem;
  }

  .pixel-form-group {
    margin-bottom: 1.5rem;
  }

  .pixel-label {
    display: block;
    color: #ffffff;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-family: 'VT323', monospace;
  }

  .pixel-select,
  .pixel-input,
  .pixel-textarea {
    width: 100%;
    padding: 0.75rem;
    background: #000000;
    border: 2px solid #ffffff;
    color: #fff;
    font-family: 'VT323', monospace;
    font-size: 1.2rem;
  }

  .pixel-input:focus,
  .pixel-select:focus,
  .pixel-textarea:focus {
    outline: none;
    background: #111111;
  }

  .pixel-textarea {
    resize: vertical;
    min-height: 80px;
  }

  .pixel-radio-group {
    display: flex;
    gap: 2rem;
  }

  .pixel-radio {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .radio-text {
    font-size: 1.2rem;
    color: #fff;
  }

  .pixel-submit-btn {
    width: 100%;
    padding: 1rem;
    background: #000000;
    border: 3px solid #ffffff;
    color: #fff;
    font-family: 'Press Start 2P', cursive;
    font-size: 1.2rem;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .pixel-submit-btn:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .pixel-back-btn {
    display: block;
    text-align: center;
    color: #cccccc;
    font-size: 1.2rem;
    text-decoration: none;
    padding: 0.5rem;
    border: 2px solid #cccccc;
    background: #000000;
  }

  .pixel-back-btn:hover {
    color: #ffffff;
    border-color: #ffffff;
    background: #222222;
  }
</style>
