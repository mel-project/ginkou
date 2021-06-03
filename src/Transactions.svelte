<script lang="typescript">
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import Button from '@smui/button';
    import { wallet_dump, wallet_dump_default, MEL } from './utils';
    import type { CoinData, Transaction } from './utils';
    import { createEventDispatcher } from 'svelte';
    import TransactionSummary from './TransactionSummary.svelte';

    export let active_wallet: string | null;

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

    const display_hash = (hash: string) => `${hash.slice(0, 5)}..`;

    // Compute total value flowing out of wallet from a list of coins
    function net_spent(outputs: CoinData[], self_covhash: string): number {
        return outputs
            .filter(cd => cd.covhash != self_covhash)
            .filter(cd => cd.denom == MEL)
            .map(cd => cd.value)
            .reduce( (a,b) => a+b )
    }

    $: wallet_dump_promise = active_wallet == null ?
            wallet_dump_default:
            wallet_dump(active_wallet)
                .ifLeft(e => dsptch_err(e))
                .orDefault(wallet_dump_default);
</script>

<Dialog
  bind:open={summary_open}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
    <TransactionSummary tx={active_tx} />
</Dialog>

{#await wallet_dump_promise}
    <p>loading history..</p>
{:then wallet_dump}
    <DataTable stickyHeader table$aria-label="Transactions Table">
        <Head>
            <Row>
                <Cell>Hash</Cell>
                <Cell numeric>Spent (mel)</Cell>
                <Cell>Block Height</Cell>
            </Row>
        </Head>
        <Body>
            <!-- List unconfirmed txs -->
            {#each Object.entries(wallet_dump.full.tx_in_progress) as [txhash, tx]}
                <Row on:click={() => {
                        summary_open = true;
                        active_tx = tx;
                }}>
                    <Cell>{display_hash(txhash)}</Cell>
                    <Cell>{net_spent(tx.outputs, wallet_dump.summary.address)}</Cell>
                    <Cell>pending</Cell>
                </Row>
            {/each}

            <!-- List confirmed txs -->
            {#each Object.entries(wallet_dump.full.tx_confirmed) as [txhash, [tx, height]]}
                    <Row on:click={() => {
                            summary_open = true;
                            active_tx = tx;
                    }}>
                    <Cell>{display_hash(txhash)}</Cell>
                    <Cell>{tx.outputs[0].value}</Cell>
                    <Cell>{height}</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
{:catch e}
    <p>{e}</p>
{/await}
