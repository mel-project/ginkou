<script lang="typescript">
  import { Title, Content, Actions, Header } from "@smui/dialog";
  import Dialog from "@/components/UI/windows/Dialog.svelte";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import Button from "@/components/UI/inputs/Button.svelte";
  import { wallet_dump, wallet_dump_default, net_spent } from "../utils";
  import type { CoinData, Transaction, WalletDump } from "../utils";
  import { createEventDispatcher, getContext } from "svelte";
  import TransactionSummary from "../components/TransactionSummary.svelte";

  import { derived } from "svelte/store";
  import type { Readable } from "svelte/store";

  const { current_wallet_dump } = getContext("melwalletd");
  // Whether a summary window is open
  let summary_open: boolean = false;
  // Transaction to display in a summary window
  let selected_tx: [string, Transaction, number | null] | null = null;

  const dispatcher = createEventDispatcher();

  function dsptch_err(msg: any) {
    dispatcher("error", {
      text: msg,
    });
  }
  // used for testing the layout of open dialogs
  // $: {
  //   if ($sorted_confirmed_txx) {
  //     let [txhash, [tx, height]] = $sorted_confirmed_txx[0];
  //     selected_tx = [txhash, tx, height];
  //     summary_open = true;
  //   }
  // }
  // remove above in prod
  const sorted_confirmed_txx: Readable<
    [string, [Transaction, number]][] | null
  > = derived(current_wallet_dump, ($dump) => {
    if ($dump) {
      let txx = Object.entries(($dump as WalletDump).full.tx_confirmed);
      txx.sort((a, b) => a[1][1] - b[1][1]);
      txx.reverse();
      // console.log(txx);
      return txx;
    } else {
      return null;
    }
  });
</script>

<Dialog
  bind:open={summary_open}
  on:close={()=>summary_open = false}
  fullscreen
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
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
  <DataTable
    class="transactions"
    table$aria-label="Transactions Table"
    style="max-width: 100%"
  >
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
        <Row
          class="disable-row"
          on:click={() => {
            summary_open = false;
            selected_tx = [tx, null];
          }}
        >
          <Cell style="overflow: hidden; text-overflow:ellipsis">{txhash}</Cell>
          <Cell>{net_spent(tx, $current_wallet_dump.summary.address)}</Cell>
          <Cell>pending</Cell>
        </Row>
      {/each}

      <!-- List confirmed txs -->
      {#each $sorted_confirmed_txx as [txhash, [tx, height]]}
        <Row
          on:click={() => {
            summary_open = true;
            selected_tx = [txhash, tx, height];
          }}
        >
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

<style lang="scss">
  :global(table) {
    width: 100%;
  }
  :global(.disable-row) {
    background: rgba(0, 0, 0, 0.08) !important;
  }
</style>
