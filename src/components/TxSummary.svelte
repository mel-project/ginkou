<script lang="ts">
  import type { Transaction } from "../utils/types";
  import { denom2str, kind2str } from "../utils/utils";

  export let transaction: Transaction;
  export let txhash: string | null = null;
  export let selfAddr: string | null = null;
  export let simplified: boolean = false;
  export let height: number | null = null;
</script>

<div class="root">
  {#if height}
    <a
      href={`https://scan.themelio.org/blocks/${height}/${txhash}`}
      target="_blank"
      rel="noopener">view on Melscan &#x2197;</a
    >
  {/if}

  <div class="header">Output coins</div>
  <table class="table table-borderless">
    <tbody>
      {#each transaction.outputs as output, i}
        {#if !simplified || output.covhash != selfAddr || (kind2str(transaction.kind) === "Swap" && i == 0)}
          <tr class:self={output.covhash === selfAddr}>
            <td class="covhash">
              {output.covhash == selfAddr ? "(self)" : output.covhash}
            </td>
            <td class="amount">
              {output.value.div(1000000)}
              {denom2str(output.denom)}
            </td>
          </tr>
        {/if}
      {/each}
      <tr>
        <td>Fee</td>
        <td class="amount text-danger">{transaction.fee.div(1000000)} MEL</td>
      </tr>
    </tbody>
  </table>

  {#if !simplified}
    <div class="header">Input coins</div>
    <table class="table table-borderless">
      <tbody>
        {#each transaction.inputs as input}
          <tr>
            <td class="txhash">
              {input.txhash}
            </td>
            <td class="index">
              {input.index}
            </td>
          </tr>
        {/each}
        <tr>
          <td>Fee</td>
          <td class="amount text-danger">{transaction.fee.div(1000000)} MEL</td>
        </tr>
      </tbody>
    </table>
  {/if}
</div>

<style lang="scss">
  a {
    font-style: italic;
    font-size: 110%;
    display: block;
    margin-bottom: 1rem;
  }

  .root {
    overflow-x: hidden;
  }

  .self .covhash {
    color: var(--primary-color);
    font-weight: 600;
  }

  .self {
    background-color: #ffffff50;
    border: 1px var(--dark-color) solid;
  }

  .header {
    font-weight: 600;
    opacity: 0.8;
  }
  .table {
    font-size: 95%;
  }

  .covhash {
    overflow-x: hidden;
    text-overflow: ellipsis;
    max-width: 50vw;
  }

  .txhash {
    overflow-x: hidden;
    text-overflow: ellipsis;
    max-width: 70vw;
  }

  .index {
    text-align: right;
  }

  .amount {
    width: 9rem;
    font-weight: 600;
    text-align: right;
  }
</style>
