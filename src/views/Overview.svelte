<script lang="ts">
  import {
    DenomBubble,
    HomeHero,
    Modal,
    ReceiveDialog,
    SendDialog,
  } from "components";
  import { Denom } from "melwallet.js";
  import { currentWalletSummary } from "../stores";
  let sendOpen = false;
  let recvOpen = false;
  let balances: [Denom, bigint][];
  $: {
    // remove all undefined values
    balances = Object.entries($currentWalletSummary.detailed_balance).filter(
      ([_k, v]) => v
    ) as typeof balances;
  }
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
    melBalance={$currentWalletSummary?.total_micromel
      ? $currentWalletSummary?.total_micromel
      : 0n}
    onSend={() => (sendOpen = true)}
    onReceive={() => (recvOpen = true)}
  />
  <div class="denom-bubbles">
    {#if $currentWalletSummary}
      {#each balances as [k, v]}
        <DenomBubble value={v} denom={k} />
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
