<script lang="typescript">
    import { tap_faucet, send_mel, confirm_tx, new_wallet } from './utils';
    import { EitherAsync } from 'purify-ts/EitherAsync';
    import { createEventDispatcher } from 'svelte';
    import { list_wallets } from './utils';
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import Select, { Option } from '@smui/select';
    import IconButton from '@smui/icon-button';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from '@smui/button';
    import Menu from '@smui/menu';
    import List, { Item, Separator, Text } from '@smui/list';
    import { onMount } from 'svelte';
    import Send from './Send.svelte';
    import Settings from './Settings.svelte';
    import CreateWallet from './CreateWallet.svelte';

    const walletd_addr = 'http://127.0.0.1:12345';
    const faucet_url = (wallet_name: string) => walletd_addr + '/wallets/' + wallet_name + '/send-faucet';
    const create_wallet_url = (wallet_name: string) => walletd_addr + '/wallets/' + wallet_name;

    export let name;
    // Current network being used (default main)
    let active_net: number = 1;
    // Current wallet being used
    let active_wallet: string | null = null;
    // wallet name to info
    let wallets = {};
    // Regenerate wallet list by the active network
    $: wallets_by_net = Object.entries(wallets)
                            .filter(x => x[1].network == active_net)
                            .map(x => x[0]);
    // Network name to integer id
    let networks = {"Main" : 255, "Test" : 1};
    // Name of a new wallet if being defined
    let new_wallet_name: string | null;
    // User-viewable error reporting
    let error_msg: string[] = [];
    // Active tab in UI
    let active_tab = 'Send';
    // Top bar icon menu dropdown state
    let menu;

    // When active net changes, nullify the active wallet
    $: {
        active_net;
        active_wallet = null;
    };

    function error_handler(event) {
        add_error_msg(event.detail.text);
    }

    function sent_tx_handler(event) {
        // TODO put events in a banner colored by type
        add_error_msg(event.detail.text);
    }

    function add_error_msg(e: string) {
        error_msg = [...error_msg, e];

        // Remove message after 5 seconds
        setTimeout(() => {
            // lifo queue
            error_msg = error_msg.slice(1);
        }, 5000);
    }

    onMount(async () => {
        // Fetch the list of wallets
        const res = await list_wallets().run();
        wallets = res
            .ifLeft( e => {
                /*
                errorDispatcher('error', {
                    text: e
                });
                */
                add_error_msg(e);
            })
            .orDefault([]);

        if ( !localStorage )
            add_error_msg("Unable to access storage, are cookies blocked?");
    });

    /*
    <div class="view">
        <h1>Themelio wallet</h1>

        <!-- show faucet tx if using test net -->
        {#if active_net == 1}
            <Button on:click={() => tap_faucet( faucet_url(active_wallet) ).run()}>Tap Faucet</Button>
        {/if}

        <p>{JSON.stringify(wallets[active_wallet])}</p>

        <!--<NewWallet bind:value={new_wallet_name} bind:value={active_net} />-->
        <Button on:click={() =>
            new_wallet(
                create_wallet_url(active_wallet),
                active_net == networks["Test"] ? true : false)
                .run()
            }>Tap Faucet</Button>
    </div>
    */
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

        <!-- Report errors to user-->
        {#if error_msg.length > 0}
            <div class="error-msg">
                {#each error_msg as msg}
                    <p>{msg}</p>
                {/each}
            </div>
        {/if}

        {#if active_tab == "Send"}
            <Send on:error={error_handler} on:sent-tx={sent_tx_handler} bind:active_wallet {wallets} />
        {:else if active_tab == "Receive"}
            <p>WIP</p>
        {:else if active_tab == "Transactions"}
            <p>WIP ;)</p>
        {:else if active_tab == "Settings"}
            <Settings bind:active_net {networks} />
            <div class="create-wallet-container">
                <h3>Create New Wallet</h3>
                <CreateWallet on:error={error_handler} {networks} {active_net} />
            </div>
        {/if}
    </div>
</main>

<style>
    .create-wallet-container {
        padding: 3em;
    }

    .error-msg {
        color: red;
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