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
</script>

<h1>Log Match</h1>

{#if message}
  <div style="color: red">{message}</div>
{/if}

<form method="POST" use:enhance>
  <div>
    <label>
      Character *
      <select name="characterId" required bind:value={selectedCharacter}>
        <option value="">Select a character</option>
        {#each data.characters as character}
          <option value={character.id}>{character.name}</option>
        {/each}
      </select>
    </label>
  </div>
  
  <div>
    <label>Result *</label>
    <div>
      <label>
        <input type="radio" name="won" value="true" required />
        Win
      </label>
      <label>
        <input type="radio" name="won" value="false" />
        Loss
      </label>
    </div>
  </div>
  
  <div>
    <label>
      Opponent
      <input type="text" name="opponent" />
    </label>
  </div>
  
  <div>
    <label>
      Note
      <textarea name="note"></textarea>
    </label>
  </div>
  
  <button type="submit">Log Match</button>
</form>

<a href="/characters">Back to Characters</a>