<script lang="ts">
  import { currentWalletName, currentWalletSummary } from "../stores";
  import { slide, fade } from "svelte/transition";
  import {
    denom2str,
    prepare_tx,
    send_tx,
    unlock_wallet,
  } from "../utils/utils";
  import RoundButton from "./RoundButton.svelte";
  import ArrowTopRight from "svelte-material-icons/ArrowTopRight.svelte";
  import Check from "svelte-material-icons/Check.svelte";
  import BigNumber from "bignumber.js";
  import type { Transaction } from "../utils/types";
  import TxSummary from "./TxSummary.svelte";

  export let onTransactionSent = () => {};

  let recipient: string =
    "t1m9v0fhkbr7q1sfg59prke1sbpt0gm2qgrb166mp8n8m59962gdm0";
  let amount: string = "100";
  let denom: string = "6d";

  let pending: boolean = false;
  let preparedTx: Transaction | null = null;

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
        value: new BigNumber(amount).multipliedBy(1000000),
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
        if ($currentWalletSummary.locked) {
          let pwd = prompt("Enter wallet password");
          if (pwd) {
            let result = await unlock_wallet($currentWalletName, pwd).run();
            result.ifLeft((err) => {
              onError(err);
              return;
            });
          }
        }
        console.log("unlocked");
        let result = await send_tx($currentWalletName, preparedTx).run();
        result
          .ifLeft((err) => {
            onError(err);
          })
          .ifRight((_) => {
            preparedTx = null;
            onTransactionSent();
          });
      } finally {
        pending = false;
      }
    }
  };
</script>

<div on:click={() => (sendError = null)}>
  {#if sendError}
    <div class="alert alert-danger" role="alert" transition:slide>
      {sendError}
    </div>
  {/if}

  {#if $currentWalletSummary}
    {#if preparedTx}
      <div>
        <TxSummary
          transaction={preparedTx}
          changeAddr={$currentWalletSummary.address}
        />

        <div class="section final">
          <RoundButton label="Confirm" disabled={pending} onClick={onConfirm}>
            {#if pending}
              <div class="spinner-border" role="status" />
            {:else}
              <Check width="1.5rem" height="1.5rem" />
            {/if}&nbsp;
          </RoundButton>
          &nbsp;&nbsp;
          <RoundButton
            label="Cancel"
            disabled={pending}
            onClick={onCancel}
            outline
          />
        </div>
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
          </div>

          <div class="input-group">
            <span class="input-group-text">Amount</span>
            <input
              type="number"
              placeholder="Enter an amount"
              class="form-control"
              disabled={pending}
              bind:value={amount}
            />
            <select class="form-select" disabled={pending} bind:value={denom}>
              {#each Object.keys($currentWalletSummary.detailed_balance) as denom}
                <option value={denom}>{denom2str(denom)}</option>
              {/each}
            </select>
          </div>
        </div>

        <div class="section final">
          <RoundButton
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
          </RoundButton>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  .alert {
    border-radius: 1rem;
    margin-bottom: 2rem;
  }
  .header {
    font-weight: 600;
    opacity: 0.8;
  }
  .input-group-text {
    width: 6rem;
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
