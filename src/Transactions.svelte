<script lang="typescript">
    import { tx_history } from './utils';
    import { EitherAsync } from 'purify-ts/EitherAsync';
    import type { TxHistory } from './utils';
    import { createEventDispatcher } from 'svelte';

    export let active_wallet: string | null;

    const dispatcher = createEventDispatcher();

    function dsptch_err(msg) {
        dispatcher('error', {
            text: msg
        })
    }

    //$: txs = async () =>
    $: txs =
        tx_history(active_wallet)
            .ifLeft(e => dsptch_err(e))
            .orDefault({
                tx_in_progress: [],
                tx_confirmed: [],
            });
            //.run();
</script>

{#if active_wallet}
    {#await txs}
        <p>loading history..</p>
    {:then txs_res}
        <p>{JSON.stringify(txs_res)}</p>
    {/await}
{/if}
