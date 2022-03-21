<script lang="ts">
  import WalletSelector from "../components/WalletSelector.svelte";
  import HomeHero from "../components/HomeHero.svelte";
  import DenomBubble from "../components/DenomBubble.svelte";
  import Modal from "../components/Modal.svelte";
  import { currentWalletSummary } from "../stores";
  import BigNumber from "bignumber.js";
  import { denom2str, kind2str } from "../utils/utils";
  import SendDialog from "../components/SendDialog.svelte";

  let sendOpen = false;
</script>

<div>
  <WalletSelector />

  <Modal
    pullup
    title="Send assets"
    open={sendOpen}
    onClose={() => (sendOpen = false)}
  >
    <SendDialog onTransactionSent={() => (sendOpen = false)} />
  </Modal>

  <HomeHero
    melBalance={$currentWalletSummary?.total_micromel.div(1000000).toFixed(6)}
    otherBalance="3.14"
    onSend={() => (sendOpen = true)}
    onReceive={() => alert("receive")}
  />
  <div class="denom-bubbles">
    {#if $currentWalletSummary}
      {#each Object.entries($currentWalletSummary.detailed_balance) as [k, v]}
        <DenomBubble value={v.div(1000000).toFixed(6)} denom={denom2str(k)} />
      {/each}
    {/if}
  </div>
</div>

<style lang="scss">
  .denom-bubbles {
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 4rem;
  }
</style>
