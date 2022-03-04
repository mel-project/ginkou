<script lang="typescript">
import Dialog from "@/components/UI/windows/Dialog.svelte";
import Button from "@/components/UI/inputs/Button.svelte";
import { createEventDispatcher, getContext, onMount } from "svelte";
import TransactionSummary from "../components/TransactionSummary.svelte";

import { derived } from "svelte/store";
import type { Readable } from "svelte/store";
import type { Either } from "purify-ts/Either";
import { net_spent } from "../utils/utils";

interface PendingDataTable<T>{
  head: string[]
  body: T[]
}


const { current_wallet_dump, sorted_confirmed_txx } = getContext("melwalletd");
// Whether a summary window i> open
let summary_open: boolean = false;
// Transaction to display in a summary window
let selected_tx: [string, Transaction, number | null] | null = null;

// $: table: DataTable<Either_Transaction> = {
//   head: ["text","text", "text"],
//   body: (()=>{
//     let unconfirmed: UnconfirmedTransaction = Object.entries($current_wallet_dump.full.tx_in_progress);
//   })()
// }



// // used for testing the layout of open dialogs
// $: {
//   if ($sorted_confirmed_txx) {
//     let [txhash, [tx, height]] = $sorted_confirmed_txx[0];
//     selected_tx = [txhash, tx, height];
//     summary_open = true;
//   }
// }
// // remove above in prod

</script>

<Dialog
  bind:open={summary_open}
  on:close={()=>summary_open = false}
  fullscreen
  aria-labelledby="simple-title"
  aria-describedby="simple-content">
  <template>
    {#if selected_tx && summary_open}
      <TransactionSummary
        txhash={selected_tx[0]}
        tx={selected_tx[1]}
        height={selected_tx[2]}
        current_wallet_dump={$current_wallet_dump}
      />
    {/if}
  </template>

  <svelte:fragment let:close slot="actions">
    <Button on:click={close}>Done</Button>
  </svelte:fragment>
</Dialog>

{#if $current_wallet_dump && $sorted_confirmed_txx}
  <table
    class="transactions"
    style="max-width: 100%"
  >
    <tr>
        <th class="cell" style="width: 50%">Hash</th>
        <th class="cell">Spent (µMEL)</th>
        <th class="cell">Block Height</th>
    </tr>
      <!-- List unconfirmed txs -->
      {#each Object.entries($current_wallet_dump.full.tx_in_progress) as [txhash, tx]}
        <tr class="row disable-row"
          on:click={() => {
            summary_open = false;
            selected_tx = [tx, null];
          }}
        >
          <td class="cell" style="overflow: hidden; text-overflow:ellipsis">{txhash}</td>
          <td class="cell">{net_spent(tx, $current_wallet_dump.summary.address)}</td>
          <td class="cell">pending</td>
        </tr>
      {/each}

      <!-- List confirmed txs -->
      {#each $sorted_confirmed_txx as [txhash, [tx, height]]}
        <tr class="row"
          on:click={() => {
            summary_open = true;
            selected_tx = [txhash, tx, height];
          }}
        >
          <td class="cell">{txhash}</td>
          <td class="cell">{net_spent(tx, $current_wallet_dump.summary.address)}</td>
          <td class="cell">{height}</td>
        </tr>
      {/each}
  </table>
{:else}
  <i>loading...</i>
{/if}

<style lang="scss">
  :global(table) {
    width: 100%;
  }
  :global(.disable-row) {
    background: rgba(0, 0, 0, 0.08) !important;
  }
</style>
