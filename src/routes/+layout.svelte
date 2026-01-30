<script>
  export let data;
</script>

<main>
  <slot />
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Press Start 2P', system-ui, sans-serif;
    background-color: var(--color-bg);
    color: var(--color-text-main);
  }
</style>