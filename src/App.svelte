<script lang="ts">
  import { register_console_loggers } from "utils/utils";
  register_console_loggers();
  import {
    currentWalletName,
    currentWalletSummary,
    last_tab,
    default_tab,
    persistent_tabs,
    getWalletSummaries,
  } from "./stores";
  import {
    BottomTabs,
    Modal,
    WalletCreator,
    WalletSelector,
  } from "./components";
  import { onMount } from "svelte";
  import {
    Overview,
    PasswordPrompt,
    Settings,
    Swap,
    Transactions,
  } from "./views";

  if (!$persistent_tabs) $last_tab = $default_tab;
  let selectedTab: number = 0;
  let firstDialog = false;

  $: {
    getWalletSummaries().then((either) => {
      let list = either.unsafeCoerce();
      // //if the wallet name cookie doesn't exist in the wallet list, unset the cookie
      // //this can happen if a machine changes melwalletd databases
      if (Object.keys(list).indexOf($currentWalletName || "") < 0) {
        $currentWalletName = null;
      }
      // if a wallet cookie exists use it; get the first wallet in the list; else null
      $currentWalletName = $currentWalletName || Object.keys(list)[0] || null;
      firstDialog = $currentWalletName === null;
    });
  }
  onMount(async () => {});
  let handleEvent = (event: CustomEvent) => {
    event.detail._callback();
  };
</script>

<main>
  <Modal open={firstDialog} onClose={() => {}} title="Get started">
    <WalletCreator onCreate={() => (firstDialog = false)} />
  </Modal>
  <div class="main-container">
    <WalletSelector />
    {#if $currentWalletSummary}
      {#if $currentWalletSummary.locked && $last_tab !== 3}
        <PasswordPrompt on:idk={handleEvent} />
      {:else if $last_tab === 0}
        <div>
          <Overview />
        </div>
      {:else if $last_tab === 1}
        <div>
          <Swap />
        </div>
      {:else if $last_tab === 2}
        <div>
          <Transactions />
        </div>
      {:else if $last_tab === 3}
        <div>
          <Settings />
        </div>
      {/if}
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
