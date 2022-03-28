<script lang="ts">
  import BottomTabs from "./components/BottomTabs.svelte";
  import Modal from "./components/Modal.svelte";
  import RoundButton from "./components/RoundButton.svelte";
  import WalletCreator from "./components/WalletCreator.svelte";
  import { currentWalletName } from "./stores";
  import Overview from "./views/Overview.svelte";
  import Transactions from "./views/Transactions.svelte";

  let selectedTab: number = 0;
  let firstDialog = $currentWalletName === null;
</script>

<main>
  <Modal open={firstDialog} onClose={() => {}} title="Get started">
    <WalletCreator onCreate={() => (firstDialog = false)} />
  </Modal>

  <div class="main-container">
    {#if selectedTab === 0}
      <Overview />
    {:else if selectedTab === 1}
      <Transactions />
    {:else if selectedTab === 2}{:else}{/if}
  </div>
  <BottomTabs
    onSelect={(selection) => {
      selectedTab = selection;
    }}
    selected={selectedTab}
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
