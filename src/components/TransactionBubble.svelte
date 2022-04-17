<script lang="ts">
  import type { Transaction } from "../utils/types";
  import BigNumber from "bignumber.js";
  import { currentWalletName, currentWalletSummary } from "../stores";
  import {
    denom2str,
    kind2str,
    showToast,
    transaction_balance,
    transaction_full,
  } from "../utils/utils";
  import { onDestroy } from "svelte";
  import { derived, writable } from "svelte/store";
  import type { Readable, Writable } from "svelte/store";
  export let txhash: string;
  export let height: number;

  import ArrowTopRight from "svelte-material-icons/ArrowTopRight.svelte";
  import ArrowBottomLeft from "svelte-material-icons/ArrowBottomLeft.svelte";
  import SwapVertical from "svelte-material-icons/SwapVertical.svelte";
  import JSONbig from "json-bigint";
  import Modal from "./Modal.svelte";
  import TxSummary from "./TxSummary.svelte";
  const JBig = JSONbig({ alwaysParseAsBig: true });

  let balance: Writable<[boolean, { [key: string]: BigNumber }] | null> =
    writable(null);

  // Fire off whe nthis element is first observaable
  const onIntersection = (entries: any, observer: any) => {
    for (const { isIntersecting, target } of entries) {
      if (isIntersecting && loading) {
        console.log("something becoming visible");
        (async () => {
          if ($currentWalletName) {
            let res = await transaction_balance(
              $currentWalletName,
              txhash
            ).run();
            res
              .ifLeft((err) => console.log(err))
              .ifRight((res) => {
                balance.set(res);
              });
          }
        })();
        observer.unobserve(target);
      }
    }
  };
  const options = {
    root: null,
    rootMargin: "50px 0px",
    threshold: [0],
  };
  let self: Element | null;
  const observer = new IntersectionObserver(onIntersection, options);
  $: {
    self && observer.observe(self);
  }

  $: loading = !$balance;

  let rxText = "Unknown";
  let direction = 0;
  $: {
    if ($balance) {
      let seenOut = false;
      let seenIn = false;
      Object.entries($balance[1]).forEach((a) => {
        if (a[1].lt(0)) {
          seenOut = true;
        }
        if (a[1].gt(0)) {
          seenIn = true;
        }
      });
      if (seenIn && seenOut) {
        rxText = "Swap funds";
        direction = 0;
      } else if (seenOut) {
        rxText = "Send funds";
        direction = -1;
      } else {
        rxText = "Receive funds";
        direction = 1;
      }
    }
  }

  let modalOpen = false;
  let loadedTx: Transaction | null = null;

  $: loadDetails = async () => {
    if ($currentWalletName) {
      modalOpen = true;
      let txn = await transaction_full($currentWalletName, txhash).run();
      txn
        .ifLeft((err) => showToast(err))
        .ifRight((res) => {
          loadedTx = res;
        });
    }
  };
</script>

<div
  class="wrap"
  bind:this={self}
  class:loading
  class:loaded={!loading}
  class:pending={height < 0}
>
  <Modal
    open={modalOpen}
    title="Transaction details"
    onClose={() => (modalOpen = false)}
  >
    {#if loadedTx}
      <TxSummary
        transaction={loadedTx}
        selfAddr={$currentWalletSummary?.address}
        {txhash}
        {height}
      />
    {/if}
  </Modal>

  <div class="root" on:click={() => height > 0 && loadDetails()}>
    <div class="icon">
      {#if direction > 0}
        <ArrowBottomLeft width="1.5rem" height="1.5rem" />
      {:else if direction < 0}
        <ArrowTopRight width="1.5rem" height="1.5rem" />
      {:else}
        <SwapVertical width="1.5rem" height="1.5rem" />
      {/if}
    </div>
    <div class="label">
      <div class="rx-tx">{rxText}</div>
      <div class="height">
        {#if height < 0}
          <div class="spinner-border" role="status" />
          Pending
        {:else}
          Confirmed at {height}
        {/if}
      </div>
      <!-- <div class="txhash">{txhash}</div> -->
    </div>
    <div class="amount">
      {#if $balance}
        {#each Object.entries($balance[1]) as [denom, num]}
          {#if num.toNumber()}
            <div>
              {#if num.gte(0)}
                <span class="text-primary"
                  ><b>+{num.div(1000000).toFixed(6)}</b>
                  {denom2str(denom)}</span
                >
              {:else}
                <span class="text-danger"
                  ><b>{num.div(1000000).toFixed(6)}</b> {denom2str(denom)}</span
                >
              {/if}
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .height {
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
  }

  .spinner-border {
    width: 0.9rem;
    height: 0.9rem;
  }

  .loaded > div > div {
    filter: none;
    transition: all 0.2s ease-in-out;
  }

  b {
    font-weight: 600;
  }

  .txhash {
    font-size: calc(min(1.7vw, 8px));
    margin-top: -2px;
    font-family: "Iosevka";
  }

  .pending {
    opacity: 0.5;
  }

  .rx-tx {
    font-weight: 500;
  }
  .wrap {
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
  }
  .root {
    background-color: #006e5410;
    height: 4rem;
    border-radius: 1rem;
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: var(--dark-color);
  }

  .icon {
    width: 2rem;
    min-width: 2rem;
    height: 2rem;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: 100px;
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow-x: hidden;
    white-space: nowrap;
    // max-width: calc(70vw - 5rem);
  }

  .amount {
    text-align: right;
    font-size: 0.9rem;
  }

  .mel {
    background-image: url("/images/mel-coin.png");
    background-size: contain;
  }

  .sym {
    background-image: url("/images/sym-coin.png");
    background-size: contain;
  }

  .send {
    color: var(--dark-color);
  }
</style>
