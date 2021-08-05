<script lang="typescript">
  import type { WalletSummary } from "./utils";
  import { list_wallets, get_priv_key } from "./utils";
  import {setContext, getContext} from 'svelte'
  import {writable} from 'svelte/store'

  import { Row, Section, Title } from "@smui/top-app-bar";
  //import Banner from '@smui/banner';
  import Tab, { Label } from "@smui/tab";
  import TabBar from "./components/tabs/TabBar.svelte";

  import Send from "./views/Send.svelte";
  import Receive from "./views/Receive.svelte";
  import CreateWallet from "./components/CreateWallet.svelte";
  import Transactions from "./views/Transactions.svelte";
  import Settings from "./views/Settings.svelte"
  import WalletMenu from "./components/WalletMenu.svelte";
  import { settings } from "./store";
  $: ({current_wallet} = settings)

  import Hamburger from "./components/Hamburger.svelte";
  import TransactionIcon from './res/icons/transactions.svg';
  import SendIcon from './res/icons/send.svg';
  import RecieveIcon from './res/icons/recieve.svg';
  import SettingsIcon from './res/icons/settings.svg';
  import Modal from "./components/Modal.svelte";


  export let name;

  const tabs = ["Transactions", "Send", "Receive"]
  const tab_icons = {"Transactions": TransactionIcon, "Send": SendIcon, "Receive": RecieveIcon}

  // change this cuz wtf
  const tab_components = Object.assign({},...[Transactions, Send, Receive].map((comp,i)=>({[tabs[i]]:comp})))

  const setting_types = [
    {name: "network", type: "select", options: {test: "test", main: "main"}},
    {name: "network2", type: "select", options: {test: "test", main: "main"}},
    {name: "persistent_tabs", type: "checkbox"},
    {name: "default_tab" ,type: "select", options: {Transactions: "Transactions", Send: "Send", Recieve: "Recieve"}, depends: {persistent_tabs: false}},
    {name: "current_wallet", type: "input", options: {test: "test", main: "main"}},
    {name: "shane_wallet", type: "input", depends: {current_wallet: "shane"}},
  ] 
  const defaults = {network: "test"}
  
  let modal_view = true;
  // Active tab in UI
  let active_tab = "Transactions";
  // Indicates whether the side nav bar is active
  let wallet_menu_is_active = false;
  // Indicates whether secret key will be visible
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
  {#if modal_view}
    <Modal on:closeModal="{()=>{modal_view=false}}">
        <Settings setting_types={setting_types}
        ></Settings>
    </Modal>
  {/if}
  <input type="button" class="open-settings"
    on:click={()=>modal_view=true} value="Settings">
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
          <TabBar class="tab-bar"
            {tabs}
            bind:active_tab={active_tab}
            let:tab
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
    <!-- !!two way settings bindings -->
    <div class="view-box">
      <svelte:component this={tab_components[active_tab]}
        on:error={notify_err_event} on:sent-tx={notify_sent_tx_event} 
      />
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

.open-settings{
  position: absolute;
  bottom: 3em;
  right: 3em;
}
</style>
