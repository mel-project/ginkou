<script lang="ts">
  import { Denom, Transaction } from "melwallet.js";
  import { SwapInfo } from "melwallet.js";
  import { prepare_swap_tx, swap_info } from "../utils/wallet-utils";
  import { currentWalletName, currentWalletSummary } from "../stores";
  import SwapVertical from "svelte-material-icons/SwapVertical.svelte";

  import debounce from "debounce";
  import { Button, DenomPicker, Modal, SendDialog } from "components";
  import { showToast, to_millions } from "utils/utils";

  let payDenom = Denom.MEL;
  let recvDenom = Denom.SYM;

  let payValue: bigint = 0n;
  let payValueString = "";
  let previousPayValueString = "";

  let receiveValue: bigint = 0n;

  let swapInfo: SwapInfo | null = null;
  let pay_value: number | null = null;

  $: {
    let value = $currentWalletSummary?.detailed_balance.get(payDenom);
    if (value) {
      pay_value = to_millions(value);
    } else {
      pay_value = null;
    }
  }

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
  $: {
    ((_a, _b) => onUpdate())(payDenom, recvDenom);
  }

  const validate = (_node: any, _s: string) => {
    return {
      update(s: string) {
        try {
          let res = BigInt(s ? s : "0") * 1_000_000n;
          let valid = res < 2n ** 64n;
          // res.isInteger() && res.isPositive() && res.isLessThan(2n.pow(64));
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
      } catch (err: any) {
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
      {#if $currentWalletSummary &&  $currentWalletSummary.detailed_balance.get(payDenom)}
        Balance: <span style="font-weight: 600">
          {pay_value}
          &nbsp;{payDenom.toString()}
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
      ≈ {receiveValue / 1_000_000n}
    </div>
    <DenomPicker bind:denom={recvDenom} blacklist={[payDenom]} />
  </div>

  <div class="details-card card container-fluid">
    <div class="row">
      <div class="col">Exchange rate</div>
      <div class="col text-end highlight">
        {receiveValue < 0 && !pending ? payValue / BigInt(receiveValue) : "-"}
      </div>
    </div>
    <div class="row">
      <div class="col">Price impact</div>
      <div
        class="col text-end highlight"
        class:success={!pending && swapInfo && swapInfo.price_impact < 0}
        class:warning={!pending && swapInfo && swapInfo.price_impact < 0.01}
        class:danger={!pending && swapInfo && swapInfo.price_impact < 0.1}
      >
        {receiveValue < 0 && swapInfo && !pending
          ? swapInfo.price_impact * 100n + "%"
          : "-"}
      </div>
    </div>
    <div class="row">
      <div class="col">Approx. swap fees</div>
      <div class="col text-end highlight">
        {payValue / 200n / 1_000_000n + " " + payDenom.toString()}
      </div>
    </div>
  </div>

  <div class="button-protector">
    <Button
      disabled={pending || payValue == 0n}
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
