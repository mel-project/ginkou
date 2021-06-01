<script lang="typescript">
    import { tap_faucet, send_mel, confirm_tx, new_wallet } from './utils';
    import type { Wallet } from './utils';
    import { EitherAsync } from 'purify-ts/EitherAsync';
    import { list_wallets } from './utils';
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import Select, { Option } from '@smui/select';
    import IconButton from '@smui/icon-button';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Menu from '@smui/menu';
    import List, { Item, Separator, Text } from '@smui/list';
    import { onMount } from 'svelte';
    import Send from './Send.svelte';
    import Settings from './Settings.svelte';
    import CreateWallet from './CreateWallet.svelte';
    import Transactions from './Transactions.svelte';

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
    // Top bar icon menu dropdown state
    let menu;

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
    <div class="top-app-bar-container">
        <TopAppBar
            variant="static">
            <Row>
                <Section>
                    <IconButton
                        on:click={() => menu.setOpen(true)}
                        class="material-icons">
                        menu
                    </IconButton>

                    <Menu bind:this={menu}>
                        <List>
                            {#each wallets_by_net as wallet}
                                <Item on:SMUI:action={() => (active_wallet = wallet)}>
                                    <Text>{wallet}</Text>
                                </Item>
                            {/each}
                        </List>
                    </Menu>

                    <Title>Ginko</Title>
                </Section>

                <Section>
                    <!-- Select wallet -->
                    <Select bind:value={active_wallet} label="Wallet">
                    {#each wallets_by_net as wallet}
                        <Option value={wallet}>{wallet}</Option>
                    {/each}
                    </Select>
                </Section>
            </Row>
            <div class="tabs-container">
                <TabBar tabs={['Transactions', 'Send', 'Receive', 'Settings']}
                        position="static"
                        let:tab
                        bind:active={active_tab}>
                    <Tab {tab}>
                        <Label>{tab}</Label>
                    </Tab>
                </TabBar>
            </div>
        </TopAppBar>
    </div>

    <div class="view">

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

        {#if active_tab == "Send"}
            <Send on:error={notify_err_event} on:sent-tx={notify_sent_tx_event} bind:active_wallet {wallets} />
        {:else if active_tab == "Receive"}
            <p>WIP</p>
        {:else if active_tab == "Transactions"}
            <Transactions on:error={notify_err_event} {active_wallet} />
        {:else if active_tab == "Settings"}
            <Settings
                on:sent-tx={notify_sent_tx_event}
                on:error={notify_err_event}
                bind:active_net
                {networks}
                {active_wallet} />
            <div class="create-wallet-container">
                <h3>Create New Wallet</h3>
                <CreateWallet on:error={notify_err_event} {networks} {active_net} />
            </div>
        {/if}
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

    .top-app-bar {
        margin: 0;
        background: #ffffff;
    }

    .view {
        text-align: center;
        padding: 1em;
        max-width: 360px;
        margin: 0 auto;
    }

    h1 {
        color: #067b7f;
        text-transform: uppercase;
        font-size: 3em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>

<svelte:head>
    <!-- Fonts -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700">

    <!-- Material Typography -->
    <link rel="stylesheet" href="https://unpkg.com/@material/typography@11.0.0/dist/mdc.typography.css" />

    <!-- SMUI -->
    <!--<link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />-->
    <link rel="stylesheet" href="/build/smui.css" />
</svelte:head>