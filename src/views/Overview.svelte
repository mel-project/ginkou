<script lang="ts">
  import {
    DenomBubble,
    HomeHero,
    Modal,
    ReceiveDialog,
    SendDialog,
  } from "components";
  import { denom_to_string } from "melwallet.js";
  import { currentWalletSummary } from "../stores";
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
    melBalance={String(
      $currentWalletSummary
        ? $currentWalletSummary?.total_micromel / BigInt(1000000)
        : BigInt(0)
    )}
    otherBalance="3.14"
    onSend={() => (sendOpen = true)}
    onReceive={() => (recvOpen = true)}
  />
  <div class="denom-bubbles">
    {#if $currentWalletSummary}
      {#each Object.entries($currentWalletSummary.detailed_balance) as [k, v]}
        <DenomBubble
          value={String(v / BigInt(1000000))}
          denom={denom_to_string(k)}
        />
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
