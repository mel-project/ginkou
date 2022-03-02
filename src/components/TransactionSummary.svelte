<script lang="typescript">
  import { denom2str, kind2str } from "../utils";
  import type { Transaction } from "../utils";
  import BigNumber from "bignumber.js";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import { xlink_attr } from "svelte/internal";
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
        Additional_data: ``

    }
  })
</script>

<div>
  {#if height}
    <i><a
        href={`${melscan_url()}/blocks/${height}/${txhash}`}
        target="_blank"
        rel="noopener">
      view in Melscan &#x2197;
    </a></i> 
  {/if}
  <h3>Summary</h3>
  <LayoutGrid style="padding: 0; font-size: 90%" innerGrid$class="tight-grid">
    {#each Object.entries(transaction_info) as entry}
      <Cell span="3" style={table_key_style}>{entry[0].replace("_"," ")}</Cell>
      <Cell span="9" style={table_val_style}>{entry[1]}</Cell>
    {/each}
  </LayoutGrid>

  <h3>Inputs</h3>
  <LayoutGrid style="padding: 0; font-size: 90%" innerGrid$class="tight-grid">
    {#each tx.inputs as input, i}
      <Cell span="3" style={table_key_style}>Input {i}</Cell>
      <Cell span="9" style={table_val_style}>
        {input.txhash}-{input.index}
      </Cell>
    {/each}
  </LayoutGrid>

  <h3>Outputs</h3>
  <LayoutGrid style="padding: 0; font-size: 90%" innerGrid$class="tight-grid">
    {#each outputs as output}
      {#each Object.entries(output) as entry}
        <Cell span="3" style={table_key_style}>{entry[0].replace("_"," ")}</Cell>
        <Cell span="9" style={table_val_style}>{@html entry[1]}</Cell>
      {/each}
      <Cell span="12" />
    {/each}

  </LayoutGrid>
</div>

<style>
  h3 {
    color: black;
    padding-top: 10px;
  }

  :global(.tight-grid) {
    gap: 6px !important;
  }
</style>
