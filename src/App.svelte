<script lang="typescript">
    import { tap_faucet, send_mel, confirm_tx, new_wallet } from './utils';
    import { EitherAsync } from 'purify-ts/EitherAsync';
    import { createEventDispatcher } from 'svelte';
    import { list_wallets } from './utils';
    //import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import Select, { Option } from '@smui/select';
    import Textfield from '@smui/textfield';
    import Tab, { Label } from '@smui/tab';
    import TabBar from '@smui/tab-bar';
    import Button from '@smui/button';
    import { onMount } from 'svelte';

    const walletd_addr = 'http://127.0.0.1:12345';
    const faucet_url = (wallet_name: string) => walletd_addr + '/wallets/' + wallet_name + '/send-faucet';
    const create_wallet_url = (wallet_name: string) => walletd_addr + '/wallets/' + wallet_name;

    export let name;
    // Current network being used
    let using_net: number = 0;
    // Current wallet being used
    let using_wallet: string;
    // wallet name to info
    let wallets = {};
    // Network name to integer id
    let networks = {"Main" : 255, "Test" : 1};
    // Amount to send in a tx
    let send_amount: number = 0;
    // Name of a new wallet if being defined
    let new_wallet_name: string | undefined;
    // User-viewable error reporting
    let error_msg = '';
    // Active tab in UI
    let active_tab = 'Send';

    const errorDispatcher = createEventDispatcher();

    function error_handler(event) {
        error_msg = event.detail.text;
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
                error_msg = e;
            })
            .orDefault([]);

        console.log(wallets);
    });
</script>

<main>
    <div class="top-bar-container">
        <!--<TopAppBar
            variant="static">
            <Row>
                <Section>-->
                    <TabBar tabs={['Transactions', 'Send', 'Recieve']}
                            position="static"
                            let:tab
                            bind:active={active_tab}>
                        <Tab {tab}>
                            <Label>{tab}</Label>
                        </Tab>
                    </TabBar>
                <!--</Section>
            </Row>
        </TopAppBar>-->
    </div>

    <div class="view">
        <h1>Themelio wallet</h1>

        <!-- Report errors to user-->
        {#if error_msg != ''}
            <p>{error_msg}</p>
        {/if}

        <Select bind:value={using_net} label="Network">
        {#each Object.entries(networks) as net}
            <Option value={net[1]}>{net[0]}</Option>
        {/each}
        </Select>

        <Select bind:value={using_wallet} label="Wallet">
        {#each Object.entries(wallets)
                .filter(x => x[1].network == using_net)
                .map(x => x[0]) as wallet}
            <Option value={wallet}>{wallet}</Option>
        {/each}
        </Select>

        <!-- show faucet tx if using test net -->
        {#if using_net == 1}
            <Button on:click={() => tap_faucet( faucet_url(using_wallet) ).run()}>Tap Faucet</Button>
        {/if}

        <p>{JSON.stringify(wallets[using_wallet])}</p>

        <!--<NewWallet bind:value={new_wallet_name} bind:value={using_net} />-->
        <Button on:click={() =>
            new_wallet(
                create_wallet_url(using_wallet),
                using_net == networks["Test"] ? true : false)
                .run()
            }>Tap Faucet</Button>

        <!-- Send TXs -->
        {#if using_wallet }
            <Textfield bind:value={send_amount}
                label="Amount"
                type="number"
                suffix="mel" />

            <Button on:click={() => send_mel(using_wallet, send_amount)}>Send</Button>
        {/if}
    </div>
</main>

<style>
    .view {
        text-align: center;
        padding: 1em;
        max-width: 240px;
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
    <link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
</svelte:head>