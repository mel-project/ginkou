<script lang="ts">
  import Settings from "./views/Settings.svelte";
  import BottomTabs from "./components/BottomTabs.svelte";
  import Modal from "./components/Modal.svelte";
  import RoundButton from "./components/RoundButton.svelte";
  import WalletCreator from "./components/WalletCreator.svelte";
  import { currentWalletName } from "./stores";
  import Overview from "./views/Overview.svelte";
  import Transactions from "./views/Transactions.svelte";
  import WalletSelector from "./components/WalletSelector.svelte";
  import { slide } from "svelte/transition";

  import { last_tab, default_tab, persistent_tabs, getWalletSummaries } from "./stores";
  import Swap from "./views/Swap.svelte";
  import { onMount } from "svelte";
  
  if (!$persistent_tabs) $last_tab = $default_tab;
  let selectedTab: number = 0;
  let firstDialog = false;
  onMount(async ()=>{
    let either = await getWalletSummaries();
    let list = either.unsafeCoerce() 
    console.log(list)
    $currentWalletName =  $currentWalletName || Object.keys(list)[0] || null;
    console.log($currentWalletName)
    firstDialog = $currentWalletName === null;
  
  })
  
</script>

<main>
  <Modal open={firstDialog} onClose={() => {firstDialog = false}} title="Get started">
    <WalletCreator onCreate={() => (firstDialog = false)} />
  </Modal>
  <div class="main-container">
    <WalletSelector />

    {#if $last_tab === 0}
      <div transition:slide>
        <Overview />
      </div>
    {:else if $last_tab === 1}
      <div transition:slide>
        <Swap />
      </div>
    {:else if $last_tab === 2}
      <div transition:slide>
        <Transactions />
      </div>
    {:else if $last_tab === 3}
      <div transition:slide>
        <Settings />
      </div>
    {/if}
  </div>
  <BottomTabs bind:selected={$last_tab} />
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
