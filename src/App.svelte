<script lang="ts">
  import { register_console_loggers } from "utils/utils";
  // register_console_loggers();
  import {
    currentWalletName,
    currentWalletSummary,
    last_tab,
    default_tab,
    persistent_tabs,
    walletList,
  } from "./stores";
  import {
    BottomTabs,
    Modal,
    WalletCreator,
    WalletSelector,
  } from "./components";
  import {
    Overview,
    PasswordPrompt,
    Settings,
    Swap,
    Transactions,
  } from "./views";
  if (!$persistent_tabs) $last_tab = Number($default_tab);
  $last_tab = Number($last_tab);
  let firstDialog = false;
  $: {
    let list = $walletList;
    if (list.length == 0) {
      firstDialog = true;
    } else {
      // //if the wallet name cookie doesn't exist in the wallet list, unset the cookie
      // //this can happen if a machine changes melwalletd databases
      if (list.indexOf($currentWalletName) < 0) {
        $currentWalletName = "";
      }
      // if a wallet cookie exists use it; get the first wallet in the list; else "%null%"
      $currentWalletName = $currentWalletName || list[0];
      // console.debug($currentWalletName);
      firstDialog = $currentWalletName === "%null%";
    }
  }
  let handleEvent = (event: CustomEvent) => {
    event.detail._callback();
  };
</script>

<main>
  <Modal open={firstDialog} onClose={() => {}} title="Get started">
    <WalletCreator onCreate={() => (firstDialog = false)} />
  </Modal>
  <div class="main-container">
    {#if $walletList.length}
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
