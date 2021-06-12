<script lang="typescript">
  import List, { Item, Text } from "@smui/list";
import { current_wallet, wallet_summaries } from "./store";
  import type { WalletSummary } from "./utils";
  import WalletMenuItem from "./WalletMenuItem.svelte";
</script>

<div id="wallet-menu-inner">
  {#each Object.entries($wallet_summaries) as [wlt, wlt_content]}
    <!-- <Item on:SMUI:action={() => (active_wallet = wlt)}>
        <Text>{wlt}</Text>
      </Item> -->
    <div on:click={() => ($current_wallet = wlt)}>
      <WalletMenuItem
        name={wlt}
        wallet={wlt_content}
        selected={wlt === $current_wallet}
      />
    </div>
  {/each}
</div>

<style>

</style>
