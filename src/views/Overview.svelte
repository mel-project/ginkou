<script lang="ts">
  import WalletSelector from "../components/templates/WalletSelector.svelte";
  import HomeHero from "../components/molecules/HomeHero.svelte";
  import DenomBubble from "../components/molecules/DenomBubble.svelte";
  import Modal from "../components/atoms/Modal.svelte";
  import { currentWalletSummary } from "../stores";
  import BigNumber from "bignumber.js";
  import { denom2str, kind2str } from "../utils/utils";
  import ReceiveDialog from "../components/organisms/ReceiveDialog.svelte";
import SendDialog from "../components/organisms/SendDialog.svelte";

  let sendOpen = false;
  let recvOpen = false;
</script>

<div>
  <Modal
    pullup
    title="Send assets"
    open={sendOpen}
    onClose={() => (sendOpen = false)}
  >
    <SendDialog
      onTransactionSent={() => {
        console.log("TRANSACTION IS SENT!");
        sendOpen = false;
      }}
    />
  </Modal>

  <Modal
    pullup
    title="Receive assets"
    open={recvOpen}
    onClose={() => (recvOpen = false)}
  >
    <ReceiveDialog />
  </Modal>

  <HomeHero
    melBalance={$currentWalletSummary?.total_micromel.div(1000000).toFixed(6)}
    otherBalance="3.14"
    onSend={() => (sendOpen = true)}
    onReceive={() => (recvOpen = true)}
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
