<script lang="typescript">
  import type { WalletSummary } from "./utils";
  import { list_wallets, get_priv_key } from "./utils";

  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  //import Banner from '@smui/banner';
  import IconButton from "@smui/icon-button";
  import Button from "@smui/button";
  import Tab, { Label } from "@smui/tab";
  import TabBar from "./components/tabs/TabBar.svelte";
  import { onMount } from "svelte";

  import Send from "./Send.svelte";
  import Receive from "./Receive.svelte";
  import CreateWallet from "./CreateWallet.svelte";
  import Transactions from "./Transactions.svelte";
  import WalletMenu from "./WalletMenu.svelte";
  import { current_wallet } from "./store";

  import Hamburger from "./components/Hamburger.svelte";
  import TransactionIcon from './res/icons/transactions.svg';
  import SendIcon from './res/icons/send.svg';
  import RecieveIcon from './res/icons/recieve.svg';
  import SettingsIcon from './res/icons/settings.svg';

  export let name;


  const tabs = ["Transactions", "Send", "Receive", "Settings"]
  const tab_icons = {"Transactions": TransactionIcon, "Send": SendIcon, "Receive": RecieveIcon, "Settings": SettingsIcon}

  let networks = { Main: 255, Test: 1 };
  // Active tab in UI
  let active_tab = "Send";
  // Indicates whether the side nav bar is active
  let wallet_menu_is_active = false;
  // Indicates whether secret key will be visible
  let show_secret_key = false;
  // User-viewable error reporting
  let error_chan: string[] = [];
  // Channel to notify when a tx has been sent
  let sent_tx_chan: string[] = [];
  // Push a message to one of the main notification channels of this UI
  // (error_chan, sent_tx_chan)
  function notify_err_event(e: any) {
    notify_err(e.detail.text);
  }
  function notify_err(msg: string) {
    error_chan = [...error_chan, msg];

    // Remove message after 5 seconds
    setTimeout(() => {
      // lifo queue
      error_chan = error_chan.slice(1);
    }, 5000);
  }

  function notify_sent_tx_event(e: any) {
    notify_sent_tx(e.detail.text);
  }
  function notify_sent_tx(msg: string) {
    sent_tx_chan = [...sent_tx_chan, msg];

    // Remove message after 5 seconds
    setTimeout(() => {
      // lifo queue
      sent_tx_chan = sent_tx_chan.slice(1);
    }, 5000);
  }
  
</script>

<main>
  <div class="top-bar">
    <!--<TopAppBar
            variant="static">-->
    <Row>
      <Section>
        <div id="wallet-title-section">
          <Hamburger class="hamburger-menu" bind:menuOpen={wallet_menu_is_active} />
          <span id="wallet-title">
            <Title>{$current_wallet}</Title>
          </span>
        </div>
      </Section>

      <Section>
        <div id="tabs-container">
          <!--
                        {#each ['Transactions', 'Send', 'Receive', 'More'] as tab}
                            <div class="tab" on:click={() => (active_tab = tab)}>
                                <Label>{tab}</Label>
                            </div>
                        {/each}
                        -->
          <TabBar
            {tabs}
            let:tab
            bind:active_tab
          >
            <Tab {tab}>
              <Label>
                <span class="tab-content">
                  <span class="icon">
                    {@html tab_icons[tab]}
                  </span>
                  <span class="text">{tab}</span>
                </span>
                
              </Label>
            </Tab>
          </TabBar>
        </div>
      </Section>
    </Row>
    <!--</TopAppBar>-->
  </div>

  <div id="sent-tx-notification-banner">
    <!-- Report sent-txs to user-->
    {#if sent_tx_chan.length > 0}
      <div class="sent-tx-notif-container">
        {#each sent_tx_chan as msg}
          <p>{msg}</p>
        {/each}
      </div>
    {/if}
  </div>

  <div id="error-notification-banner">
    <!-- Report errors to user-->
    {#if error_chan.length > 0}
      <div class="error-notif-container">
        {#each error_chan as msg}
          <p>{msg}</p>
        {/each}
      </div>
    {/if}
  </div>

  <div class="content">
    <div id="wallet-menu" class:active={wallet_menu_is_active}>
      <WalletMenu />
    </div>
    <div class="view-box">
      {#if active_tab == "Send"}
        <Send on:error={notify_err_event} on:sent-tx={notify_sent_tx_event} />
      {:else if active_tab == "Receive"}
        <Receive />
      {:else if active_tab == "Transactions"}
        <Transactions on:error={notify_err_event} />
      {:else if active_tab == "Settings"}
        {#if $current_wallet}
          <Button on:click={() => (show_secret_key = !show_secret_key)}
            >Show Secret Key</Button
          >
          {#if show_secret_key}
            <div id="private-key-view">
              {#await get_priv_key($current_wallet, window.prompt("Enter password") ?? "")}
                decrypting...
              {:then sk}
                {new TextDecoder().decode(sk)}
              {:catch e}
                {e}
              {/await}
            </div>
          {/if}
        {/if}
      {/if}
    </div>
  </div>
</main>

<svelte:head>
  <!-- Fonts -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />

  <!-- SMUI -->
  <!--<link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />-->
  <link rel="stylesheet" href="/build/smui.css" />
</svelte:head>

<style type="text/scss">
@use 'styles/app.scss';
@use 'styles/app-wide.scss';
.icon{
  display: flex;
  width: 1.5em;
}
.tab-content>.text{
  display: none;
}
@media all and (min-width: 45em){
  .tab-content{
    display: flex;
    line-height: 10em;
    .text{
      display: inherit;
      margin-left: .5em;
    }
  }
}
#wallet-title-section{
  width: inherit;
}
</style>
