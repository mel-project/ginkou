<script lang="typescript">
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Button from '@smui/button';
    import { wallet_dump, wallet_dump_default, net_spent } from './utils';
    import type { CoinData, Transaction } from './utils';
    import { createEventDispatcher } from 'svelte';
    import TransactionSummary from './TransactionSummary.svelte';
    import { current_wallet_dump } from './store';
    import { derived } from 'svelte/store';
    import type { Readable } from 'svelte/store';

    // Whether a summary window is open
    let summary_open: boolean = false;
    // Transaction to display in a summary window
    let active_tx: Transaction | null = null;

    const dispatcher = createEventDispatcher();

    function dsptch_err(msg) {
        dispatcher('error', {
            text: msg
        })
    }

    const sorted_confirmed_txx: Readable<[string, [Transaction, number]][] | null> =  derived(current_wallet_dump, $dump => {
        if ($dump) {
            let txx = Object.entries($dump.full.tx_confirmed);
            txx.sort((a, b) => a[1][1] - b[1][1]);
            txx.reverse();
            console.log(txx);
            return txx
        } else {
            return null
        }
    });
</script>

<Dialog
  bind:open={summary_open}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
    <TransactionSummary tx={active_tx} />
</Dialog>

{#if $current_wallet_dump && $sorted_confirmed_txx}
    <DataTable table$aria-label="Transactions Table" style="max-width: 100%">
        <Head>
            <Row>
                <Cell style="width: 50%">Hash</Cell>
                <Cell>Spent (µMEL)</Cell>
                <Cell>Block Height</Cell>
            </Row>
        </Head>
        <Body>
            <!-- List unconfirmed txs -->
            {#each Object.entries($current_wallet_dump.full.tx_in_progress) as [txhash, tx]}
                <Row on:click={() => {
                        summary_open = true;
                        active_tx = tx;
                }}>
                    <Cell style="overflow: hidden; text-overflow:ellipsis">{txhash}</Cell>
                    <Cell>{net_spent(tx, $current_wallet_dump.summary.address)}</Cell>
                    <Cell>pending</Cell>
                </Row>
            {/each}

            <!-- List confirmed txs -->
            {#each $sorted_confirmed_txx as [txhash, [tx, height]]}
                    <Row on:click={() => {
                            summary_open = true;
                            active_tx = tx;
                    }}>
                    <Cell>{txhash}</Cell>
                    <Cell>{net_spent(tx, $current_wallet_dump.summary.address)}</Cell>
                    <Cell>{height}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
    {:else}
    <i>loading...</i>
{/if}

<style>
    :global(table) {
        width: 100%
    }
</style>