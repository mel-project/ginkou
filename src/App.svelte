<script>
    import Select, { Option } from '@smui/select';
    import Button from '@smui/button';
    import { onMount } from 'svelte';

    const walletd_addr = 'http://127.0.0.1:12345';

    export let name;
    let using_net = 0;
    let using_wallet = [];
    // wallet name to info
    let wallets = {};
    // Network name to integer id
    let networks = {"Main" : 0, "Test" : 1};

    onMount(async () => {
        const res = await fetch(walletd_addr + '/wallets');
        wallets = await res.json();
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
        <Option>{wallet}</Option>
    {/each}
    </Select>
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