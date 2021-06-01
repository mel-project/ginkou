<script lang="typescript">
    import { tap_faucet } from './utils';
    import { createEventDispatcher } from 'svelte';
    import Select, { Option } from '@smui/select';
    import Button from '@smui/button';

    // Network name to integer id mapping taken from top-level App
    export let networks;
    // Current network in use
    export let active_net: number;
    // Current wallet in use
    export let active_wallet: string | null;

    // Event dispatch
    const dispatcher = createEventDispatcher();
    function dsptch_err(msg) {
        dispatcher('error', {
            text: msg
        })
    }

    async function faucet_tx_handler() {
        if (active_wallet == null) {
            dsptch_err('Choose a wallet to send from')
        } else {
            await tap_faucet(active_wallet)
                .ifLeft( err => dsptch_err(err) )
                .ifRight( txhash => {
                    dispatcher('sent-tx', {
                        text: `faucet transaction has been sent: ${txhash}`
                    });
                })
                .run();
        }
    }
</script>

<!-- Select network -->
<Select bind:value={active_net} label="Network">
{#each Object.entries(networks) as net}
    <Option value={net[1]}>{net[0]}</Option>
{/each}
</Select>

<!-- show faucet tx if using test net -->
{#if active_net == 1 && active_wallet != null }
    <Button on:click={async () => await faucet_tx_handler()}>Tap Faucet</Button>
{/if}
