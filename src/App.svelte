<script lang="typescript">
    import type { Wallet } from './utils';
    import { list_wallets } from './utils';

    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    //import Banner from '@smui/banner';
    import IconButton from '@smui/icon-button';
    import Button from '@smui/button';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import { onMount } from 'svelte';

    import Send from './Send.svelte';
    import Settings from './Settings.svelte';
    import CreateWallet from './CreateWallet.svelte';
    import Transactions from './Transactions.svelte';
    import WalletMenu from './WalletMenu.svelte';

    export let name;
    // Current network being used (default main)
    let active_net: number = 1;
    // Current wallet being used
    let active_wallet: string | null = null;
    // wallet name to info
    let wallets: { [key: string]: Wallet } = {};
    // Regenerate wallet list by the active network
    $: wallets_by_net = Object.entries(wallets)
                            .filter(x => x[1].network == active_net)
                            .map(x => x[0]);
    // Network name to integer id
    let networks = {"Main" : 255, "Test" : 1};
    // Active tab in UI
    let active_tab = 'Send';
    // Indicates whether the side nav bar is active
    let wallet_menu_is_active = true;
    // Indicates whether secret key will be visible
    let show_secret_key = false;

    // User-viewable error reporting
    let error_chan: string[] = [];
    // Channel to notify when a tx has been sent
    let sent_tx_chan: string[] = [];

    // When active net changes, nullify the active wallet
    $: {
        active_net;
        active_wallet = null;
    };

    // Push a message to one of the main notification channels of this UI
    // (error_chan, sent_tx_chan)
    function notify_err_event(e) {
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

    function notify_sent_tx_event(e) {
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

    function toggle_side_nav() {
    }

    onMount(async () => {
        // Fetch the list of wallets
        const res = await list_wallets().run();
        wallets = res
            .ifLeft( e => {
                notify_err_event(e);
            })
            .orDefault([]);

        if ( !localStorage )
            notify_err("Unable to access storage, are cookies blocked?");
    });
</script>

<main>
    <div class="top-bar">
        <TopAppBar
            variant="static">
            <Row>
                <Section>
                    <IconButton
                        on:click={() => (wallet_menu_is_active = !wallet_menu_is_active)}
                        class="material-icons">
                        menu
                    </IconButton>

                    {#if active_wallet}
                    <Title>{active_wallet}</Title>
                    {/if}
                </Section>

                <Section>
                    <div class="tabs-container">
                        <TabBar tabs={['Transactions', 'Send', 'Receive', 'More']}
                                position="static"
                                let:tab
                                bind:active={active_tab}>
                            <Tab {tab}>
                                <Label>{tab}</Label>
                            </Tab>
                        </TabBar>
                    </div>
                </Section>
            </Row>
        </TopAppBar>
    </div>

    <div class="content">
        {#if wallet_menu_is_active}
        <div class="wallet-menu">
            <WalletMenu wallet_names={wallets_by_net} bind:active_wallet />
        </div>
        {/if}

        <!--<Banner open={sent_tx_chan.length > 0}>-->
            <!-- Report sent-txs to user-->
            {#if sent_tx_chan.length > 0}
            <div class="sent-tx-notif-container">
                {#each sent_tx_chan as msg}
                    <p>{msg}</p>
                {/each}
            </div>
            {/if}

            <!-- Report errors to user-->
            {#if error_chan.length > 0}
                <div class="error-notif-container">
                    {#each error_chan as msg}
                        <p>{msg}</p>
                    {/each}
                </div>
            {/if}
        <!--</Banner>-->

        <div class="view-box">
            {#if active_tab == "Send"}
                <Send on:error={notify_err_event}
                      on:sent-tx={notify_sent_tx_event}
                      {active_wallet}
                      {wallets} />
            {:else if active_tab == "Receive"}
                <p>WIP</p>
            {:else if active_tab == "Transactions"}
                <Transactions on:error={notify_err_event} {active_wallet} />
            {:else if active_tab == "More"}
                <Settings
                    on:sent-tx={notify_sent_tx_event}
                    on:error={notify_err_event}
                    bind:active_net
                    {networks}
                    {active_wallet} />

                <div class="create-wallet-container">
                    <CreateWallet on:error={notify_err_event} {networks} {active_net} />
                </div>

                {#if active_wallet}
                    <Button on:click={()=> (show_secret_key = !show_secret_key)}>Show Secret Key</Button>
                    {#if show_secret_key}
                        <textarea>{localStorage.getItem(active_wallet)}</textarea>
                    {/if}
                {/if}
            {/if}
        </div>
    </div>
</main>

<style>
    .create-wallet-container {
        padding: 3em;
    }

    .error-notif-container {
        color: red;
    }
    .sent-tx-notif-container {
        color: green;
    }

    main {
        height: 100%;
    }

    .top-bar {
        display: flex;
    }

    .content {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .view-box {
        border: 1px solid grey;
        margin: 30px 5% 30px 5%;
        padding: 30px 5% 30px 5%;
        display: flex;
        background-color: #ededed;
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>

<svelte:head>
    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">

    <!-- Material Typography -->
    <link rel="stylesheet" href="https://unpkg.com/@material/typography@11.0.0/dist/mdc.typography.css" />

    <!-- SMUI -->
    <link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
    <!--<link rel="stylesheet" href="/build/smui.css" />-->
</svelte:head>