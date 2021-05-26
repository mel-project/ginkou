<script lang="typescript">
    import { createEventDispatcher } from 'svelte';
    import { send_mel } from './utils';
    import Textfield from '@smui/textfield';
    import Button from '@smui/button';

    export let active_wallet: string;
    export let wallets;

    // Amount to send in a tx
    let send_amount: number = 0;
    // Account address to send to
    let to_addr: string = '';

    const dispatcher = createEventDispatcher();

    async function send_tx() {
        const res = await send_mel(
            active_wallet,
            wallets[active_wallet],
            to_addr,
            send_amount).run();

        dispatcher('sent-tx', {
            text: JSON.stringify(res)
        });
    }
</script>

<!-- Send TXs -->
{#if active_wallet }
    <Textfield bind:value={to_addr}
        label="To" />
    <Textfield bind:value={send_amount}
        label="Amount"
        type="number"
        suffix="mel" />

    <Button on:click={send_tx}>Send</Button>
{:else}
    <p>Choose a wallet first ;)</p>
{/if}
