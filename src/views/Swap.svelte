<script lang="ts">
  import DenomPicker from "../components/molecules/DenomPicker.svelte";
  import BigNumber from "bignumber.js";
  import {
    denom2str,
    prepare_swap_tx,
    showToast,
    swap_info,
  } from "../utils/utils";
  import type { SwapInfo } from "../utils/utils";
  import SwapVertical from "svelte-material-icons/SwapVertical.svelte";
  import { debounce } from "debounce";
  import { currentWalletName, currentWalletSummary } from "../stores";
  import type { Transaction } from "../utils/types";
  import Modal from "../components/atoms/Modal.svelte";
import SendDialog from "../components/organisms/SendDialog.svelte";
import { Button } from "../components/atoms";
  let payDenom = "6d";
  let recvDenom = "73";

  let payValue: BigNumber = new BigNumber(0);
  let payValueString = "";
  let previousPayValueString = "";

  let receiveValue: BigNumber = new BigNumber(0);

  let swapInfo: SwapInfo | null = null;
  let pending = false;
  const onUpdateDebounced = debounce(async () => {
    pending = true;
    let info = await swap_info(payDenom, recvDenom, payValue, false).run();
    info
      .ifRight((res) => {
        swapInfo = res;
        receiveValue = res.result;
      })
      .ifLeft((err) => {
        showToast(err);
      });
    pending = false;
  }, 500);

  const onUpdate = () => {
    pending = true;
    onUpdateDebounced();
  };

  // hack to run onUpdate every time the payDenom or recvDenom changes
  $: _placeholder = ((a, b) => onUpdate())(payDenom, recvDenom);

  const validate = (node: any, s: string) => {
    return {
      update(s: string) {
        BigNumber.DEBUG = true;
        try {
          let res = new BigNumber(s ? s : "0").multipliedBy(1_000_000);
          let valid =
            res.isInteger() &&
            res.isPositive() &&
            res.isLessThan(new BigNumber(2).pow(64));
          if (!valid) {
            throw "invalid big number";
          }
          payValueString = s;
          previousPayValueString = payValueString;
          payValue = res;
        } catch {
          payValueString = previousPayValueString;
        }
      },
    };
  };

  let preparedTx: Transaction | null = null;

  $: onReview = async () => {
    pending = true;
    if ($currentWalletName && swapInfo && $currentWalletSummary) {
      try {
        let res = await prepare_swap_tx($currentWalletName, swapInfo.poolkey, [
          {
            covhash: $currentWalletSummary.address,
            denom: payDenom,
            value: payValue,
            additional_data: "",
          },
        ]).run();
        res
          .ifLeft((err) => {
            throw err;
          })
          .ifRight((val) => {
            preparedTx = val;
          });
      } catch (err) {
        showToast(err);
      }
    }
    pending = false;
  };
</script>

<div class="main">
  <Modal
    title="Send transaction"
    open={preparedTx != null}
    onClose={() => (preparedTx = null)}
  >
    {#if preparedTx}
      <SendDialog
        {preparedTx}
        onTransactionSent={() => (preparedTx = null)}
        noCancel
      />
    {/if}
  </Modal>
  <div class="header">
    <div>You pay</div>
    <div>
      {#if $currentWalletSummary && payDenom in $currentWalletSummary.detailed_balance}
        Balance: <span style="font-weight: 600">
          {$currentWalletSummary.detailed_balance[payDenom]
            .dividedBy(1_000_000)
            .toFixed(6)}
          &nbsp;{denom2str(payDenom)}
        </span>
      {/if}
    </div>
  </div>
  <div class="gigantic-group">
    <input
      type="text"
      inputmode="numeric"
      class="gigantic"
      placeholder="0"
      class:tiny={payValueString.length > 10}
      bind:value={payValueString}
      use:validate={payValueString}
      on:input={() => {
        onUpdate();
      }}
    />
    <DenomPicker bind:denom={payDenom} blacklist={[recvDenom]} />
  </div>

  <div class="switch-protector">
    <Button
      label=""
      outline
      small
      onClick={() => {
        let pd = payDenom;
        payDenom = recvDenom;
        recvDenom = pd;
      }}><SwapVertical width="1rem" height="1rem" /></Button
    >
  </div>

  <div class="header">You receive</div>
  <div class="gigantic-group">
    <div class="gigantic gigantic-shifted" class:pending>
      ≈ {receiveValue.dividedBy(1_000_000).toFixed(2)}
    </div>
    <DenomPicker bind:denom={recvDenom} blacklist={[payDenom]} />
  </div>

  <div class="details-card card container-fluid">
    <div class="row">
      <div class="col">Exchange rate</div>
      <div class="col text-end highlight">
        {receiveValue.gt(0) && !pending
          ? payValue.dividedBy(receiveValue).toFixed(3)
          : "-"}
      </div>
    </div>
    <div class="row">
      <div class="col">Price impact</div>
      <div
        class="col text-end highlight"
        class:success={!pending && swapInfo && swapInfo.price_impact.gt(0)}
        class:warning={!pending && swapInfo && swapInfo.price_impact.gt(0.01)}
        class:danger={!pending && swapInfo && swapInfo.price_impact.gt(0.1)}
      >
        {receiveValue.gt(0) && swapInfo && !pending
          ? swapInfo.price_impact.multipliedBy(100).toFixed(2).toString() + "%"
          : "-"}
      </div>
    </div>
    <div class="row">
      <div class="col">Approx. swap fees</div>
      <div class="col text-end highlight">
        {payValue.dividedBy(200).dividedBy(1_000_000).toFixed(3).toString() +
          " " +
          denom2str(payDenom)}
      </div>
    </div>
  </div>

  <div class="button-protector">
    <Button
      disabled={pending || payValue.eq(0)}
      label="Review transaction"
      outline
      onClick={onReview}
    />
  </div>
</div>

<style lang="scss">
  .gigantic-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 5rem;
  }

  .tiny {
    font-size: 1.2em !important;
  }

  .switch-protector {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }

  .button-protector {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 1rem;
  }

  .main {
    padding-left: 1rem;
    padding-right: 1rem;
    color: var(--dark-color);
  }

  .details-card {
    background-color: var(--bubble-color);
    border: none;
    border-radius: 1rem;
    padding: 1rem;
    font-size: 90%;
  }

  .success {
    color: #73007b;
  }

  .warning {
    color: darkorange;
  }

  .danger {
    color: red;
  }

  .row {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
  }

  .pending {
    opacity: 0.5;
  }

  .highlight {
    font-weight: 600;
  }

  .gigantic {
    // height: 10rem;
    padding: 1rem;
    font-size: 2rem;
    line-height: 2rem;

    border: none;
    background: none;
    flex-grow: 100;
    width: auto;
    text-align: left;
    color: var(--dark-color);
    min-width: 0;
  }

  .gigantic-shifted {
    margin-left: -1.4rem;
  }

  .gigantic:focus {
    outline: none !important;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
</style>
