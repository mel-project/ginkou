<script lang="typescript">
    import {fetch_or_err} from './utils';
    import { EitherAsync } from 'purify-ts/EitherAsync';
    import Select, { Option } from '@smui/select';
    import Button from '@smui/button';
    import Textfield from '@smui/textfield';
    import { onMount } from 'svelte';

    type TxHash = string;

    const walletd_addr = 'http://127.0.0.1:12345';

    export let name;
    // Current network being used
    let using_net: number = 0;
    // Current wallet being used
    let using_wallet: string;
    // wallet name to info
    let wallets = {};
    // Network name to integer id
    let networks = {"Main" : 0, "Test" : 1};
    // Amount to send in a tx
    let send_amount: number = 0;

    /*
    async function send_mel(wallet_name: string, mel: number): Promise<Result<TxHash>> {
        const micromel = mel * 1000;
        const wallet   = wallets[wallet_name];
        const outputs  = [micromel, wallet.total_micromel - micromel];
        const addr     = walletd_addr + '/wallets/' + wallet_name;

        // Prepare tx
        const res = await fetch(addr + '/prepare-tx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                outputs: outputs,
                // TODO tmp dummy
                signing_key: "cde6cb9f4850495201db80b884135870916850e3167e6eaaa8c70895e10f462a45567a851dbf93797099d0c9557494b896e0f4d9b9cc3feb93e353221ed0bffb",
            },
        });
        const tx = await res.json();

        // Send tx
        return await fetch(addr + '/send-tx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: tx,
        })
    }
    */

    // Send faucet to given wallet. Returns a succesful request to walletd,
    // not a succesful transaction.
    const tap_faucet = (wallet_name: string): EitherAsync<string, TxHash> =>
        EitherAsync( async ({ fromPromise }) => {
            let addr = walletd_addr + '/wallets/' + wallet_name + '/send-faucet';
            let res: Response = await fromPromise(fetch_or_err(addr, { method: 'POST' }));
            return await res.text();
        });

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
        <Button on:click={() => tap_faucet(using_wallet).run()}>Tap Faucet</Button>
    {/if}

    <p>{JSON.stringify(wallets[using_wallet])}</p>

    <Textfield bind:value={send_amount}
        label="Amount"
        type="number"
        suffix="mel" />
    <!--<Button on:click={() => send_mel(using_wallet, send_amount)}>Send</Button>-->
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