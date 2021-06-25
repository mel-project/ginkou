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
    <div class='menu-item' on:click={() => ($current_wallet = wlt)}>
      <WalletMenuItem
        name={wlt}
        wallet={wlt_content}
        selected={wlt === $current_wallet}
      />
    </div>
  {/each}
</div>

<style type="text/scss">
  #wallet-menu-inner{
    overflow: hidden;
    overflow-y: scroll;
    height: calc(100vh - 5em);
    direction: rtl;
    scrollbar-color: #00796b white ;
  }
  .menu-item{
    direction: ltr;
  }

</style>
