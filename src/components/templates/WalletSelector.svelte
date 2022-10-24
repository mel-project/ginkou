<script lang="ts">
  import Button from "../atoms/Button.svelte";
  import WalletCreator from "./WalletCreator.svelte";
  import ArrowLeft from "svelte-material-icons/ArrowLeft.svelte";
  import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
  import Lock from "svelte-material-icons/LockOutline.svelte";
  import LockOpen from "svelte-material-icons/LockOpenOutline.svelte";
  import Plus from "svelte-material-icons/Plus.svelte";
  import Modal from "../atoms/Modal.svelte";
  import {
    currentWalletName,
    currentWalletSummary,
    walletSummaries,
  } from "../../stores";
  import type { WalletSummary } from "../../utils/types";
  import {lock_wallet } from "../../utils/utils";
  import { derived } from "svelte/store";
  import type { Readable } from "svelte/store";
  import { NetID } from "melwallet.js";

  let modalOpen: boolean = false;

  const mainnetWallets: Readable<[string, WalletSummary][]> = derived(
    walletSummaries,
    ($walletSummaries) => {
      return Object.entries($walletSummaries).filter((w) =>
        w[1].network === NetID.Mainnet
      );
    }
  );

  const testnetWallets: Readable<[string, WalletSummary][]> = derived(
    walletSummaries,
    ($walletSummaries) =>
      Object.entries($walletSummaries).filter((w) => w[1].network === NetID.Testnet)
  );

  let creatorOpen = false;
</script>

<div class="selector">
  <Button label="" outline small onClick={() => (modalOpen = !modalOpen)}>
    <div>
      <div
        class="icon"
        class:icon-mainnet={$currentWalletSummary?.network === NetID.Mainnet}
        class:icon-testnet={$currentWalletSummary?.network === NetID.Testnet}
      />
    </div>
    <div class="text" class:placeholder={$currentWalletName === null}>
      <b>{$currentWalletSummary?.network === NetID.Mainnet ? "Mainnet" : "Testnet"}</b
      >
      / {$currentWalletName}
    </div>
    <ChevronDown width="1.8rem" height="1.8rem" />
  </Button>
  <div
    class="lock-indicator"
    on:click={async () => {
      if ($currentWalletName) {
        await lock_wallet($currentWalletName);
      }
    }}
  >
    {#if $currentWalletSummary?.locked}
      <span class="text-primary"><Lock width="1.4rem" height="1.4rem" /></span>
    {:else}
      <span class="text-danger"
        ><LockOpen width="1.4rem" height="1.4rem" /></span
      >
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
      <Button label="back" small outline onClick={() => (creatorOpen = false)}
        ><ArrowLeft /></Button
      >
      <WalletCreator onCreate={() => (creatorOpen = false)} />
    {:else}
      <div>
        <div class="network-subtitle">
          <div>Mainnet</div>
          <Button
            label="create"
            small
            outline
            onClick={() => (creatorOpen = true)}><Plus /></Button
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
  .lock-indicator {
    height: 2em;
  }
  ::global(svg) {
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
    // max-width: 30rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    // overflow: hidden;
    // text-o
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
