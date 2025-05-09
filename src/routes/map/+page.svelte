<script>
  import { showStates } from '$lib/stores/states';
  import { showCapitals } from '$lib/stores/capitals';                          
  import Map from '../india-map/map.svelte';
  import { page } from '$app/stores';
</script>

<Map/>

<style>
  :global(body, html, #app) {
    margin: 0;
    height: 100%;
  }
</style>