<script lang="ts">
  import RoundButton from "./RoundButton.svelte";
  import WalletCreator from "./WalletCreator.svelte";
  import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";
  import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
  import Lock from "svelte-material-icons/Lock.svelte";
  import LockOpen from "svelte-material-icons/LockOpen.svelte";
  import Plus from "svelte-material-icons/Plus.svelte";
  import Modal from "./Modal.svelte";
  import {
    currentWalletName,
    currentWalletSummary,
    walletSummaries,
  } from "../stores";
  import type { WalletSummary } from "../utils/types";
  import { MAINNET, TESTNET, lock_wallet } from "../utils/utils";
  import { derived } from "svelte/store";
  import type { Readable } from "svelte/store";

  let modalOpen: boolean = false;

  const mainnetWallets: Readable<[string, WalletSummary][]> = derived(
    walletSummaries,
    ($walletSummaries) => {
      return Object.entries($walletSummaries).filter((w) =>
        w[1].network.eq(MAINNET)
      );
    }
  );

  const testnetWallets: Readable<[string, WalletSummary][]> = derived(
    walletSummaries,
    ($walletSummaries) =>
      Object.entries($walletSummaries).filter((w) => w[1].network.eq(TESTNET))
  );

  let creatorOpen = false;
</script>

<div class="selector">
  <RoundButton label="" outline small onClick={() => (modalOpen = !modalOpen)}>
    <div>
      <div
        class="icon"
        class:icon-mainnet={$currentWalletSummary?.network.eq(MAINNET)}
        class:icon-testnet={$currentWalletSummary?.network.eq(TESTNET)}
      />
    </div>
    <div class="text" class:placeholder={$currentWalletName === null}>
      <b>{$currentWalletSummary?.network.eq(MAINNET) ? "Mainnet" : "Testnet"}</b
      >
      / {$currentWalletName}
    </div>
    <ChevronDown width="1.8rem" height="1.8rem" />
  </RoundButton>
  <div class="lock-indicator" on:click={async ()=>{
   if( $currentWalletName){
     await lock_wallet($currentWalletName)
   }
  }}>
    {#if $currentWalletSummary?.locked}
      <Lock></Lock>
    {:else}
      <LockOpen></LockOpen>
    {/if}
    </div>
  <Modal
    title="Select a wallet"
    open={modalOpen}
    onClose={() => {
      creatorOpen = false;
      modalOpen = false;
    }}
  >
    {#if creatorOpen}
      <RoundButton
        label="back"
        small
        outline
        onClick={() => (creatorOpen = false)}><ArrowLeft /></RoundButton
      >
      <WalletCreator onCreate={() => (creatorOpen = false)} />
    {:else}
      <div>
        <div class="network-subtitle">
          <div>Mainnet</div>
          <RoundButton
            label="create"
            small
            outline
            onClick={() => (creatorOpen = true)}><Plus /></RoundButton
          >
        </div>

        <ul class="list-group">
          {#each $mainnetWallets as [name, wallet]}
            <li
              class="list-group-item"
              class:active={name === $currentWalletName}
              on:click={() => {
                $currentWalletName = name;
                modalOpen = false;
              }}
            >
              {name}
            </li>
          {/each}
        </ul>

        <div class="network-subtitle">Testnet</div>
        <ul class="list-group">
          {#each $testnetWallets as [name, wallet]}
            <li
              class="list-group-item"
              class:active={name === $currentWalletName}
              on:click={() => {
                $currentWalletName = name;
                modalOpen = false;
              }}
            >
              {name}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </Modal>
</div>

<style lang="scss">
  .lock-indicator{
    height: 2em;

  }
  ::global(svg){
      height: 10em;
    }
  .icon {
    border-radius: 100px;
    width: 1.2rem;
    height: 1.2rem;

    margin-left: 1rem;
    background-size: contain;
  }

  .icon-mainnet {
    background-image: url("/images/logo-only.png");
  }

  .icon-testnet {
    background-image: url("/images/logo-testnet.png");
  }

  .text {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    color: var(--dark-color);
  }

  .selector {
    height: 6rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  b {
    font-weight: 600;
  }

  .network-subtitle {
    font-weight: 600;
    font-size: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: var(--dark-color);
    opacity: 0.8;
  }
</style>
