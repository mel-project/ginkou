<script lang="ts">
	import { WalletSummary } from './../../utils/types.ts';
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
  import { lock_wallet } from "../../utils/wallet-utils";
  import { derived } from "svelte/store";
  import type { Readable } from "svelte/store";
  import { NetID, netid_to_string } from "melwallet.js";

  let modalOpen: boolean = false;

  $: console.log([...$walletSummaries.entries()])
  $: mainnetWallets = [...$walletSummaries.entries()]
  let creatorOpen = false;
</script>

<div class="selector">
  <Button label="" outline small onClick={() => (modalOpen = !modalOpen)}>
    <div>
      <div
        class="icon"
        class:icon-mainnet={$currentWalletSummary?.network === NetID.Mainnet}
      />
    </div>
    {#if $currentWalletSummary}
      <div class="text" class:placeholder={$currentWalletName === null}>
        <b>{netid_to_string($currentWalletSummary.network)}</b>
        / {$currentWalletName}
      </div>
    {/if}

    <ChevronDown width="1.8rem" height="1.8rem" />
  </Button>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          {#each mainnetWallets as [name, wallet]}
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
