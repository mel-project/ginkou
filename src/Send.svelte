<script lang="typescript">
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import { createEventDispatcher } from 'svelte';
    import { send_tx, prepare_mel_tx } from './utils';
    import type { Wallet, Transaction } from './utils';
    import Textfield from '@smui/textfield';
    import Button, { Label } from '@smui/button';

    export let active_wallet: string | null;
    export let wallets: { [key: string]: Wallet } = {};

    // Amount to send in a tx
    let send_amount: number = 0;
    // Account address to send to
    let to_addr: string = '';
    // Toggle confirmation window before sending a tx
    let open_confirmation: boolean = false;
    let prepared_tx: Transaction | null;

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
            const sk = localStorage.getItem(active_wallet);

            if ( sk == null ) {
                dsptch_err('No private key found for wallet "' + active_wallet + '"');
            } else {
                await send_tx(active_wallet, prepared_tx)
                    .ifLeft( err => dsptch_err(err) )
                    .ifRight( txhash => {
                        dispatcher('sent-tx', {
                            text: JSON.stringify(txhash)
                        });
                    })
                    .run();
            }
        }
    }

    async function prepare_tx_handler() {
        if (active_wallet == null) {
            dsptch_err('Choose a wallet to send from')
        } else {
            const sk = localStorage.getItem(active_wallet);

            if ( sk == null ) {
                dsptch_err('No private key found for wallet "' + active_wallet + '"');
            } else {
                await prepare_mel_tx(
                    active_wallet,
                    wallets[active_wallet],
                    to_addr,
                    send_amount,
                    sk)
                    .ifLeft( err => dsptch_err(err) )
                    .ifRight( tx => {
                        open_confirmation = true;
                        prepared_tx = tx;
                    })
                    .run();
            }
        }
    }
</script>

{#if prepared_tx}
<Dialog
  bind:open={open_confirmation}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
    <Label>Confirm Transaction</Label>
        <p>Send 
    <p>For {prepared_tx.fee} micromel</p>
    <li>
        <ul>{prepared_tx.fee}</ul>
    </li>

    <p>{JSON.stringify(prepared_tx)}</p>
    <Button on:click={() => (open_confirmation=false)}>Cancel</Button>

    <!-- Send Tx -->
    <Button on:click={() => {
        open_confirmation = false;
        send_tx_handler();
    }}>Confirm</Button>
</Dialog>
{/if}

{#if active_wallet }
    <Textfield bind:value={to_addr}
        label="To" />
    <Textfield bind:value={send_amount}
        label="Amount"
        type="number"
        suffix="micromel" />

    <Button on:click={prepare_tx_handler}>Send</Button>
{:else}
    <p>Choose a wallet first ;)</p>
{/if}
