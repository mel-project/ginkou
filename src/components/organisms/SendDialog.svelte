<script lang="ts">
  import { currentWalletName, currentWalletSummary } from "../../stores";
  import { prepare_tx, send_tx } from "../../utils/utils";

  import ArrowTopRight from "svelte-material-icons/ArrowTopRight.svelte";
  import Check from "svelte-material-icons/Check.svelte";
  import QrcodeScan from "svelte-material-icons/QrcodeScan.svelte";
  import TxSummary from "../molecules/TxSummary.svelte";
  import { Button, QrScanWindow, Input } from "../atoms";
  import { denom_to_string, Transaction } from "melwallet.js";
  export let onTransactionSent = () => {};
  export let noCancel = false;

  let recipient: string = "";
  let amount: bigint = BigInt(0);
  let denom: string = "6d";

  let pending: boolean = false;
  export let preparedTx: Transaction | null = null;

  let sendError: string | null = null;

  const onError = (e: string) => {
    console.error(e);
    sendError = e;
  };

  $: onPrepare = async () => {
    pending = true;
    setTimeout(async () => {
      let coinData = {
        covhash: recipient,
        value: amount * BigInt(1000000),
        denom: denom,
        additional_data: "",
      };
      let res = await prepare_tx($currentWalletName ? $currentWalletName : "", [
        coinData,
      ]).run();
      res
        .ifLeft((err) => {
          onError(err);
        })
        .ifRight((txn) => {
          preparedTx = txn;
        });
      pending = false;
    }, 500);
  };

  $: onCancel = () => {
    preparedTx = null;
  };

  $: onConfirm = async () => {
    pending = true;
    if ($currentWalletName && $currentWalletSummary && preparedTx) {
      try {
        let result = await send_tx($currentWalletName, preparedTx).run();
        result
          .ifLeft((err) => {
            onError(err);
          })
          .ifRight((_) => {
            onTransactionSent();
          });
      } finally {
        setTimeout(() => (pending = false), 1500);
      }
    }
  };

  let scannerOpen = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => (sendError = null)}>
  {#if sendError}
    <div class="alert alert-danger" role="alert">
      {sendError}
    </div>
  {/if}

  {#if $currentWalletSummary}
    {#if preparedTx}
      <div>
        <TxSummary
          transaction={preparedTx}
          selfAddr={$currentWalletSummary.address}
          simplified
        />

        <div class="section final">
          <Button label="Confirm" disabled={pending} onClick={onConfirm}>
            {#if pending}
              <div class="spinner-border" role="status" />
            {:else}
              <Check width="1.5rem" height="1.5rem" />
            {/if}&nbsp;
          </Button>
          {#if !noCancel}
            &nbsp;&nbsp;
            <Button
              label="Cancel"
              disabled={pending}
              onClick={onCancel}
              outline
            />
          {/if}
        </div>
      </div>
    {:else if scannerOpen}
      <div class="qr-canvas-wrap">
        <QrScanWindow
          onScan={(s) => {
            recipient = s;
            scannerOpen = false;
          }}
        />
      </div>
    {:else}
      <div>
        <div class="section">
          <div class="header">Recipient 1</div>

          <div class="input-group">
            <span class="input-group-text">Recipient</span>
            <input
              type="text"
              placeholder="Enter an address"
              class="form-control"
              disabled={pending}
              bind:value={recipient}
            />
            <button
              class="btn btn-outline-primary qrbutton"
              on:click={() => (scannerOpen = true)}
            >
              <QrcodeScan width="1.6rem" height="1.6rem" />
            </button>
          </div>

          <div class="input-group">
            <span class="input-group-text">Amount</span>
            <Input
              type="bigint"
              placeholder="Enter an amount"
              class="form-control"
              disabled={pending}
              bind:value={amount}
            />
            <select class="form-select" disabled={pending} bind:value={denom}>
              {#each Object.keys($currentWalletSummary.detailed_balance) as denom}
                <option value={denom}>{denom_to_string(denom)}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="section final">
          <Button
            label="Send transaction"
            outline
            disabled={pending}
            onClick={onPrepare}
          >
            {#if pending}
              <div class="spinner-border" role="status" />
            {:else}
              <ArrowTopRight width="1.5rem" height="1.5rem" />
            {/if}&nbsp;
          </Button>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  @use "../../res/styles/alerts.scss";

  .header {
    font-weight: 600;
    opacity: 0.8;
  }
  .input-group-text {
    width: 6rem;
  }

  .qrbutton {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .spinner-border {
    height: 1.5rem;
    width: 1.5rem;
  }

  .input-group {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: 4rem;
  }

  .input-group * {
    border-radius: 200px;
  }

  .form-select {
    flex: 0 0 auto !important;
    width: auto;
  }
  .form-control {
    flex-grow: 1;
  }

  // .qr-canvas {
  //   width: 40vmin;
  //   height: 40vmin;
  //   object-fit: cover;
  //   border-radius: 1rem;
  //   border: var(--primary-color) 0.2rem solid;
  // }

  .qr-canvas-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section {
    width: 100%;
  }

  .final {
    padding-top: 1rem;
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
  }
</style>
