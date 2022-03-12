<script lang="ts">
  import { TESTNET, MAINNET } from "./utils/utils";
  import { onMount, setContext } from "svelte";

  import Tab from "./components/UI/tabs/Tab.svelte";
  import TabBar from "./components/UI/tabs/TabBar.svelte";
  import Label from "./components/UI/Label.svelte";
  import Button from "./components/UI/inputs/Button.svelte";
  import Send from "./views/Send.svelte";
  import Receive from "./views/Receive.svelte";
  import Transactions from "./views/Transactions.svelte";
  import Contacts from "./views/Contacts.svelte";

  import SettingsView from "./views/Settings.svelte";
  import WalletMenu from "./components/WalletMenu.svelte";
  import { AppState, Melwalletd } from "./utils/store";
  import Hamburger from "./components/Hamburger.svelte";
  import TransactionIcon from "@/res/icons/transactions.svg";
  import SendIcon from "@/res/icons/send.svg";
  import RecieveIcon from "@/res/icons/recieve.svg";
  import SettingsIcon from "@/res/icons/settings.svg";
  import ContactsIcon from "@/res/icons/contacts.svg";

  import type { SettingConfig, State } from "./utils/types";
  import Dialog from "./components/UI/windows/Dialog.svelte";

  const tabs = ["Transactions", "Send", "Receive", "Contacts"];

  const tab_icons = {
    Transactions: TransactionIcon,
    Send: SendIcon,
    Receive: RecieveIcon,
    Contacts: ContactsIcon,
  };

  // change this cuz wtf
  const tab_components = Object.assign(
    {},
    ...[Transactions, Send, Receive, Contacts].map((comp, i) => ({
      [tabs[i]]: comp,
    }))
  );

  const setting_types: State<SettingConfig> = {
    network: {
      label: "Network",
      field: "select",
      options: { Test: TESTNET, Main: MAINNET, All: 0 },
      default: TESTNET,
    },

    default_tab: {
      label: "Default Tab",
      field: "select",
      options: {
        Transactions: "Transactions",
        Send: "Send",
        Recieve: "Receive",
      },
      depends: { persistent_tabs: false },
      default: "Transactions",
    },

    persistent_tabs: {
      label: "Persistent Tabs",
      field: "checkbox",
      visible: true,
      default: false,
    },
    current_wallet: { default: "", visible: false },
    active_tab: { default: "Send", visible: false },
    contacts: { visible: false, default: [] },
  };
  // localStorage.clear()
  const { settings } = AppState(setting_types);
  const { persistent_tabs, current_wallet, default_tab, active_tab, network } =
    settings;
  // console.log(persistent_tabs, current_wallet, default_tab, active_tab, $network)
  // const store = Store(settings)

  // show restraint when using contexts
  // pass settings as props through components if possible
  setContext("settings", { settings });
  setContext("melwalletd", Melwalletd(settings));

  // Indicates whether modal is open: true or closed: false
  let modal_is_active = false;
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
    // error_chan = [...error_chan, msg];
    error_chan = [msg];
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
    sent_tx_chan = [msg];
    // Remove message after 5 seconds
    setTimeout(() => {
      // lifo queue
      sent_tx_chan = sent_tx_chan.slice(1);
    }, 5000);
  }
  onMount(() => {
    if (!$persistent_tabs) {
      //TODO implement $last_tab setting
      // should capture the last visited tab to automatically load that tab on startup
      $active_tab = $default_tab || "Send";
    }
    // const {wallet_summaries} = store
    // console.log($wallet_summaries)
  });
</script>

<main>
  {#if modal_is_active}
    <Dialog
      title="Settings V0.0.7"
      open={modal_is_active}
      on:close={() => {
        modal_is_active = false;
      }}
    >
      <SettingsView {setting_types} {settings} />
      <Button slot="actions" let:close on:click={close}>Apply</Button>
    </Dialog>
  {/if}
  <div
    type="button"
    class="open-settings"
    on:click={() => (modal_is_active = true)}
    value="Settings"
  >
    {@html SettingsIcon}
  </div>

  <div class="top-bar">
    <div style="display: flex; justify-content: space-between; width: 100%">
      <div style="padding: 0 2em">
        <div id="wallet-title-section" style="height: 100%">
          <Hamburger
            class="hamburger-menu"
            bind:menuOpen={wallet_menu_is_active}
          />
          <span id="wallet-title">
            <Label>{$current_wallet}</Label>
          </span>
        </div>
      </div>

      <div style="padding: 0 2em">
        <div id="tabs-container">
          <TabBar class="tab-bar" {tabs} bind:active_tab={$active_tab} let:tab>
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
      </div>
    </div>
    <!--</TopAppBar>-->
  </div>
  <div class="banners">
    <div id="sent-tx-notification-banner">
      <!-- Report sent-txs to user-->
      {#if sent_tx_chan.length > 0}
        <div class="sent-tx-notif-container">
          {#each sent_tx_chan as msg}
            <p class="banner">{msg}</p>
          {/each}
        </div>
      {/if}
    </div>

    <div id="error-notification-banner">
      <!-- Report errors to user-->
      {#if error_chan.length > 0}
        <div class="error-notif-container">
          {#each error_chan as msg}
            <p class="banner">{msg}</p>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <div class="content">
    <div id="wallet-menu" class:active={wallet_menu_is_active}>
      <WalletMenu />
    </div>
    <!-- !!two way settings bindings -->
    <div class="view-box">
      <svelte:component
        this={tab_components[$active_tab]}
        on:error={notify_err_event}
        on:sent-tx={notify_sent_tx_event}
        on:notify-banner={notify_sent_tx_event}
      />
    </div>
  </div>
</main>

<svelte:head>
  <!-- Fonts -->
  <link
    rel="res/stylesheet"
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
  />
</svelte:head>

<style lang="scss">
  @use "./res/styles/theme.scss" as theme;
  @use 'res/styles/app.scss';
  @use 'res/styles/app-wide.scss';

  .open-settings {
    position: absolute;
    bottom: 3em;
    right: 3em;
    border-radius: 100%;
    width: 2em;
    height: 2em;
    background: theme.$primary;
    padding: 0.5em;
    cursor: pointer;
    fill: white;
    z-index: 100;
  }
  .banners {
    // position: absolute;
    // z-index: 99999;
    // bottom: 0;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // max-width: 100vw;
  }
  .banner {
    //   top: 0;
    // position: relative;
    // left: 0;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }
</style>
