<script lang="ts">
  import type { ActionData } from './$types.js'
  export let form: ActionData
</script>

<div class="pixel-create">
  <h2 class="pixel-title">CREATE CHARACTER</h2>
  
  {#if form?.error}
    <div class="pixel-error">{form.error}</div>
  {/if}
  
  <form method="POST" class="pixel-form">
    <div class="pixel-form-group">
      <label>NAME *</label>
      <input type="text" name="name" required class="pixel-input" />
    </div>
    
    <div class="pixel-form-group">
      <label>DESCRIPTION</label>
      <textarea name="description" rows="3" class="pixel-textarea"></textarea>
    </div>
    
    <div class="pixel-form-buttons">
      <button type="submit" class="pixel-submit-btn">CREATE</button>
      <a href="/characters" class="pixel-cancel-btn">CANCEL</a>
    </div>
  </form>
</div>

<style>
  .pixel-create {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background: #000000;
    border: 4px solid #ffffff;
    box-shadow: 0.3rem 0.3rem 0 #ffffff;
  }

  .pixel-title {
    font-family: var(--pixel-font);
    font-size: 1.2rem;
    color: #ffffff;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .pixel-error {
    background: #000000;
    color: #ffffff;
    padding: 1rem;
    border: 2px solid #ffffff;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }

  .pixel-form {
    background: #000000;
    padding: 1.5rem;
    border: 3px solid #ffffff;
  }

  .pixel-form-group {
    margin-bottom: 1.5rem;
  }

  .pixel-form-group label {
    display: block;
    color: #ffffff;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .pixel-input,
  .pixel-textarea {
    width: 100%;
    padding: 0.75rem;
    background: #000000;
    border: 2px solid #ffffff;
    color: #ffffff;
    font-family: var(--pixel-font);
    font-size: 1.2rem;
  }
  
  .pixel-input:focus,
  .pixel-textarea:focus {
    outline: none;
    background: #111111;
  }

  .pixel-textarea {
    resize: vertical;
  }

  .pixel-form-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  .pixel-submit-btn {
    flex: 2;
    padding: 1rem;
    background: #000000;
    border: 3px solid #ffffff;
    color: #ffffff;
    font-family: var(--pixel-font);
    font-size: 1rem;
    cursor: pointer;
    text-transform: uppercase;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }

  .pixel-submit-btn:hover {
    background: #222222;
    transform: translate(0.1rem, 0.1rem);
    box-shadow: 0.1rem 0.1rem 0 #ffffff;
  }

  .pixel-cancel-btn {
    flex: 1;
    padding: 1rem;
    background: #000000;
    border: 3px solid #ffffff;
    color: #cccccc;
    font-family: var(--pixel-font);
    font-size: 1rem;
    text-decoration: none;
    text-align: center;
    text-transform: uppercase;
    box-shadow: 0.2rem 0.2rem 0 #cccccc;
  }

  .pixel-cancel-btn:hover {
    background: #222222;
    color: #ffffff;
    border-color: #ffffff;
    box-shadow: 0.2rem 0.2rem 0 #ffffff;
  }
</style>
