<script lang="typescript">
  import List, { Item, Text } from "@smui/list";
  import type { Wallet } from "./utils";
  import WalletMenuItem from "./WalletMenuItem.svelte";

  export let wallets: { [key: string]: Wallet };
  export let active_wallet: string | null;
</script>

<div id="wallet-menu-inner">
  {#each Object.entries(wallets) as [wlt, wlt_content]}
    <!-- <Item on:SMUI:action={() => (active_wallet = wlt)}>
        <Text>{wlt}</Text>
      </Item> -->
    <div on:click={() => (active_wallet = wlt)}>
      <WalletMenuItem
        name={wlt}
        wallet={wlt_content}
        selected={wlt === active_wallet}
      />
    </div>
  {/each}
</div>

<style>
</style>
