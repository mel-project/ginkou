<script>
    import Select, { Option } from '@smui/select';
    import Button from '@smui/button';

    export let name;
    let using_net = "main";
    let accounts = ["acct1", "acct2"];
    let networks = ["Main", "Test"];
</script>

<main>
    <h1>Themelio wallet</h1>

    <Select bind:value={using_net} label="Network">
    {#each networks as net}
        <Option value={net}>{net}</Option>
    {/each}
    </Select>

    <p>{using_net} network</p>

    <ul>
    {#each accounts as account}
        <li>{account}</li>
    {/each}
    </ul>
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