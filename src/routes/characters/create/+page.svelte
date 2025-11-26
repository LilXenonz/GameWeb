<script lang="ts">
  import { enhance } from '$app/forms'
  import type { ActionData } from './$types.js'

  export let form: ActionData
  let message = ''
  
  $: if (form?.message) {
    message = form.message
  }
</script>

<h1>Create Character</h1>

{#if message}
  <div style="color: red">{message}</div>
{/if}

<form method="POST" use:enhance>
  <div>
    <label>
      Name *
      <input type="text" name="name" required />
    </label>
  </div>
  
  <div>
    <label>
      Description
      <textarea name="description"></textarea>
    </label>
  </div>
  
  <button type="submit">Create Character</button>
</form>

<a href="/characters">Back to Characters</a>