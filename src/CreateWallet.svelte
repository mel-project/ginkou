<script lang="typescript">
    //import { EitherAsync } from 'purify-ts/EitherAsync';
    //import { Either, Left, Right } from 'purify-ts/Either';
    import { createEventDispatcher } from 'svelte';
    import { confirm_tx, new_wallet } from './utils';

    import Button from '@smui/button';
    import Textfield from '@smui/textfield';

    export let networks;
    export let active_net: number;

    // Name of new wallet to be created
    let new_wallet_name: string = '';
    // Message to user on successful wallet creation
    let create_wallet_result: string | null = null;

    const dispatcher = createEventDispatcher();

    function dispatch_failure(err) {
        dispatcher('error', {
            'text': err
        });
    }

    // Create a wallet and store the result on success, emit an event on failure
    async function handle_create_wallet(wallet_name: string, network: number) {
        let res = await new_wallet(
            new_wallet_name,
            active_net == networks["Test"] ? true : false)
            .ifLeft( err => dispatch_failure(err) )
            .ifRight( priv_key => {
                // Write private key to storage
                localStorage.setItem(wallet_name, priv_key);
                // Notify user of success
                create_wallet_result = "wallet created!";
            })
            .run();
    }
</script>

<Textfield bind:value={new_wallet_name} label="Wallet name" />

<Button on:click={() => handle_create_wallet(new_wallet_name, active_net)}>
    Create wallet
</Button>

{#if create_wallet_result != null}
<p>{create_wallet_result}</p>
{/if}
