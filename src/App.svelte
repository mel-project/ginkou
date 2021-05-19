<script>
    import Select, { Option } from '@smui/select';
    import Button from '@smui/button';
    import Textfield from '@smui/textfield';
    import { onMount } from 'svelte';

    const walletd_addr = 'http://127.0.0.1:12345';

    export let name;
    // Current network being used
    let using_net = 0;
    // Current wallet being used
    let using_wallet = [];
    // wallet name to info
    let wallets = {};
    // Network name to integer id
    let networks = {"Main" : 0, "Test" : 1};
    // Amount to send in a tx
    let send_amount = 0;

    async function send_mel(wallet_name, mel) {
        const micromel = mel * 1000;
        const wallet   = wallets[wallet_name];
        const outputs  = [micromel, wallet.total_micromel - micromel];
        const addr     = walletd_addr + '/wallets/' + wallet_name;

        // Prepare tx
        const res = await fetch(addr + '/prepare-tx');
        const tx = await res.json();

        // Send tx
        await fetch(addr + '/send-tx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: tx,
        });
    }

    // Send faucet to given wallet. Returns a succesful request to walletd,
    // not a succesful transaction.
    async function tap_faucet(wallet_name) {
        let addr = walletd_addr + '/wallets/' + wallet_name + '/send-faucet';
        await fetch(addr);
    }

    onMount(async () => {
        const res = await fetch(walletd_addr + '/wallets');
        wallets = await res.json();
        console.log(wallets);
    });
</script>

<main>
    <h1>Themelio wallet</h1>

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
        <Button on:click={() => tap_faucet(using_wallet)}>Tap Faucet</Button>
    {/if}

    <p>{JSON.stringify(wallets[using_wallet])}</p>

    <Textfield bind:value={send_amount}
        label="Amount"
        type="number"
        suffix="mel" />
    <!-- <Button on:click={() => send_mel()}>Send</Button> -->
</main>

<style>
    main {
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