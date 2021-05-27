<script lang="typescript">
    import { createEventDispatcher } from 'svelte';
    import { send_mel } from './utils';
    import Textfield from '@smui/textfield';
    import Button from '@smui/button';

    export let active_wallet: string | null;
    export let wallets;

    // Amount to send in a tx
    let send_amount: number = 0;
    // Account address to send to
    let to_addr: string = '';

    const dispatcher = createEventDispatcher();

    function dsptch_err(msg) {
        dispatcher('error', {
            text: msg
        })
    }

    async function send_tx_handler() {
        if (active_wallet == null) {
            dsptch_err('Choose a wallet to send from')
        } else {
            const pk = localStorage.getItem(active_wallet);

            if ( pk == null ) {
                dsptch_err('No private key found for wallet "' + active_wallet + '"');
            } else {
                const res = await send_mel(
                    active_wallet,
                    wallets[active_wallet],
                    to_addr,
                    send_amount,
                    pk)
                    .ifLeft( err => dsptch_err(err) )
                    .ifRight( res => {
                        dispatcher('sent-tx', {
                            text: JSON.stringify(res)
                        });
                    })
                    .run();
            }
        }
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

    <Button on:click={send_tx_handler}>Send</Button>
{:else}
    <p>Choose a wallet first ;)</p>
{/if}
