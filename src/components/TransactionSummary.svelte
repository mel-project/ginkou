<script lang="typescript">
  import { denom2str, kind2str } from "../utils";
  import type { Transaction } from "../utils";
  import BigNumber from "bignumber.js";
  // Transaction to display
  export let tx: Transaction;
  export let txhash: string;
  export let height: number | null;
  export let current_wallet_dump: any;

  const total_output: { [key: string]: BigNumber } = (() => {
    let toret: { [key: string]: BigNumber } = {};
    for (const output of tx.outputs) {
      toret[output.denom] = (toret[output.denom] ?? new BigNumber(0)).plus(
        output.value
      );
    }
    toret["6d"] = (toret["6d"] ?? new BigNumber(0)).plus(tx.fee);
    return toret;
  })();

  const table_key_style: string = "font-weight: bold";
  const table_val_style: string =
    "color: black; overflow: hidden; text-overflow:ellipsis";
  const melscan_url = () =>
    current_wallet_dump && current_wallet_dump.summary.network == 0x01
      ? "https://scan-testnet.themelio.org"
      : "https://scan.themelio.org";
  $: transaction_info = {
    Height: height,
    Kind: kind2str(tx.kind),
    Hash: txhash,
    Total_output: Object.entries(total_output).map(entry=>{
      let [denom, val] = entry
      return `${val} ${denom2str(denom)}`
    }),
    Fee: tx.fee
  }
  $: outputs = tx.outputs.map((output,i)=>{
    return {
      [`Output_${i}`]: `${txhash}-${i}`,
      Recipient: `${output.covhash}
        <b>

          ${
            current_wallet_dump && 
            output.covhash === current_wallet_dump.summary.address
            ? " (self)" : ""
          }
        </b>`,
        Value: `${output.value}${denom2str(output.denom)}`,
        Additional_data: `""`

    }
  })
</script>

<div class="">
  {#if height}
    <i><a
        href={`${melscan_url()}/blocks/${height}/${txhash}`}
        target="_blank"
        rel="noopener">
      view in Melscan &#x2197;
    </a></i> 
  {/if}
  <h3>Summary</h3>
  <div class="layout-grid">
    {#each Object.entries(transaction_info) as entry}
        <span class="key" style={table_key_style}>{entry[0].replace("_"," ")}</span>
        <span class="value" style={table_val_style}>{entry[1]}</span>
    {/each}
  </div>

  <h3>Inputs</h3>
  <div class="layout-grid">
    {#each tx.inputs as input, i}
      <span span="3" style={table_key_style}>Input {i}</span>
      <span span="9" style={table_val_style}>
        {input.txhash}-{input.index}
      </span>
    {/each}
  </div>

  <h3>Outputs</h3>
  <div class="layout-container outputs">
    {#each outputs as output}
    <div class="layout-grid">
      {#each Object.entries(output) as entry}
        <span style={table_key_style}>{entry[0].replace("_"," ")}</span>
        <span style={table_val_style}>{@html entry[1]}</span>
      {/each}
    </div>
    {/each}

  </div>
</div>

<style lang="scss">
  .layout-container{
    .layout-grid{
      margin-bottom: 2em;
    }

  }
  .layout-grid{
    display: grid;
    grid-template-columns: minmax(12em, auto) 1fr;
  }
  h3 {
    color: black;
    padding-top: 10px;
  }

  :global(.tight-grid) {
    gap: 6px !important;
  }
</style>
