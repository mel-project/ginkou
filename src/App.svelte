<script lang="ts">
	import Settings from './views/Settings.svelte';
  import BottomTabs from "./components/BottomTabs.svelte";
  import Overview from "./views/Overview.svelte";
  import Transactions from "./views/Transactions.svelte";
	import { slide } from "svelte/transition"

  import {last_tab, default_tab, persistent_tabs} from "./stores"


  if(!$persistent_tabs) $last_tab = $default_tab;
</script>

<main>
  <div class="main-container">
    {#if $last_tab === 0}
      <div transition:slide>
        <Overview />
      </div>
    {:else if $last_tab === 1}
    <div transition:slide>
      <Transactions />
    </div>
    {:else if $last_tab === 2}
      <div transition:slide>
        <Settings/>
      </div>
    {/if}
  </div>
  <BottomTabs
    bind:selected={$last_tab}
  />
</main>

<svelte:head>
  <!-- Fonts -->
  <link
    rel="res/stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
</svelte:head>

<style lang="scss">
  .main-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100% - 4rem);
    overflow-y: scroll;
  }

  :global(button:focus) {
    box-shadow: none !important;
  }
</style>
