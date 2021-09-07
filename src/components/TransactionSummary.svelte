<script lang="typescript">
  import { Content } from "@smui/dialog";
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
    console.log(tx)
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
</script>

<Content>
  {#if height}
    <i
      ><a
        href={`${melscan_url()}/blocks/${height}/${txhash}`}
        target="_blank"
        rel="noopener"
      >
        view in Melscan &#x2197;</a
      ></i
    >
  {/if}
  <h3>Summary</h3>
  <LayoutGrid style="padding: 0; font-size: 90%" innerGrid$class="tight-grid">
    <Cell span="3" style={table_key_style}>Height</Cell>
    <Cell span="9" style={table_val_style}>{height ?? "pending"}</Cell>
    <Cell span="3" style={table_key_style}>Kind</Cell>
    <Cell span="9" style={table_val_style}>{kind2str(tx.kind)}</Cell>
    <Cell span="3" style={table_key_style}>Hash</Cell>
    <Cell span="9" style={table_val_style}>
      {txhash}
    </Cell>
    <Cell span="12" />
    <Cell span="3" style={table_key_style}>Total output</Cell>
    <Cell span="9" style={table_val_style}>
      {#each Object.entries(total_output) as [denom, val]}
        {val} {denom2str(denom)}
      {/each}
    </Cell>
    <Cell span="3" style={table_key_style}>Fee</Cell>
    <Cell span="9" style={table_val_style}>
      {#each Object.entries(total_output) as [denom, val]}
        {val} {denom2str(denom)}
      {/each}
    </Cell>
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
    {#each tx.outputs as output, i}
      <Cell span="3" style={table_key_style}>Output {i}</Cell>
      <Cell span="9" style={table_val_style}>
        {txhash}-{i}
      </Cell>
      <Cell span="3" style={table_key_style}>Recipient</Cell>
      <Cell span="9" style={table_val_style}>
        {output.covhash}
        <b
          >{current_wallet_dump &&
          output.covhash === current_wallet_dump.summary.address
            ? " (self)"
            : ""}</b
        >
      </Cell>
      <Cell span="3" style={table_key_style}>Value</Cell>
      <Cell span="9" style={table_val_style}>
        {output.value}
        {denom2str(output.denom)}
      </Cell>
      <Cell span="3" style={table_key_style}>Additional data</Cell>
      <Cell span="9" style={table_val_style}>
        &quot;{output.additional_data}&quot;
      </Cell>
      <Cell span="12" />
    {/each}
  </LayoutGrid>
</Content>

<style>
  h3 {
    color: black;
    padding-top: 10px;
  }

  :global(.tight-grid) {
    gap: 6px !important;
  }
</style>
