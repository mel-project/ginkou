<script lang="ts">
  import type { Transaction } from "../utils/types";
  import { denom2str } from "../utils/utils";

  export let transaction: Transaction;
  export let changeAddr: string | null = null;
</script>

<div>
  <div class="header">Outputs</div>
  <table class="table table-borderless">
    <tbody>
      {#each transaction.outputs as output}
        <tr class:change={output.covhash == changeAddr}>
          <td
            ><span class="covhash"
              >{output.covhash == changeAddr ? "(self)" : output.covhash}</span
            ></td
          >
          <td class="amount"
            >{output.value.div(1000000)} {denom2str(output.denom)}</td
          >
        </tr>
      {/each}
      <tr>
        <td>Fee</td>
        <td class="amount">{transaction.fee.div(1000000)} MEL</td>
      </tr>
    </tbody>
  </table>
</div>

<style lang="scss">
  .header {
    font-weight: 600;
    opacity: 0.8;
  }
  .table {
    font-size: 95%;
  }

  .change {
    opacity: 0.5;
  }

  .covhash {
    word-wrap: break-word;
    overflow-wrap: anywhere;
    letter-spacing: -0.05em;
  }

  .amount {
    width: 9rem;
    font-weight: 600;
  }
</style>
