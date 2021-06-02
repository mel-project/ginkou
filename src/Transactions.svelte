<script lang="typescript">
    import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
    import { tx_history } from './utils';
    import type { TxHistory } from './utils';
    import { createEventDispatcher } from 'svelte';

    export let active_wallet: string | null;

    const dispatcher = createEventDispatcher();

    function dsptch_err(msg) {
        dispatcher('error', {
            text: msg
        })
    }

    const display_hash = (hash: string) => `${hash.slice(0, 5)}..`;

    $: txs_promise = active_wallet == null ?
        { // Default if no wallet active
            tx_in_progress: [],
            tx_confirmed: [],
        } :
        tx_history(active_wallet)
            .ifLeft(e => dsptch_err(e))
            .orDefault({
                tx_in_progress: [],
                tx_confirmed: [],
            } as TxHistory);
</script>

{#await txs_promise}
    <p>loading history..</p>
{:then txs}
    <DataTable stickyHeader table$aria-label="Transactions Table">
        <Head>
            <Row>
                <Cell>Hash</Cell>
                <!--<Cell style="width: 100%;">To</Cell>-->
                <Cell numeric>Value</Cell>
                <Cell>Confirmed</Cell>
            </Row>
        </Head>
        <Body>
            <!-- List unconfirmed txs -->
            {#each Object.entries(txs.tx_in_progress) as [txhash, tx]}
                <Row>
                    <Cell>{display_hash(txhash)}</Cell>
                    <Cell>{tx.outputs[0].value}</Cell>
                    <Cell>false</Cell>
                </Row>
            {/each}

            <!-- List confirmed txs -->
            {#each Object.entries(txs.tx_confirmed) as [txhash, [tx, height]]}
                <Row>
                    <Cell>{display_hash(txhash)}</Cell>
                    <Cell>{tx.outputs[0].value}</Cell>
                    <Cell>true</Cell>
                </Row>
            {/each}
        </Body>
    </DataTable>
{/await}
