<script lang="ts">
  import RoundButton from "./RoundButton.svelte";
  import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
  import Modal from "./Modal.svelte";
  import {
    currentWalletName,
    currentWalletSummary,
    walletSummaries,
  } from "../stores";
  import type { WalletSummary } from "../utils/types";
  import { MAINNET, TESTNET } from "../utils/utils";
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
</script>

<div class="selector">
  <RoundButton label="" outline small onClick={() => (modalOpen = !modalOpen)}>
    <div>
      <div class="icon" />
    </div>
    <div class="text" class:placeholder={$currentWalletName === null}>
      <b>{$currentWalletSummary?.network.eq(MAINNET) ? "Mainnet" : "Testnet"}</b
      >
      / {$currentWalletName}
    </div>
    <ChevronDown width="1.8rem" height="1.8rem" />
  </RoundButton>
  <Modal
    title="Select a wallet"
    open={modalOpen}
    onClose={() => (modalOpen = false)}
  >
    <div class="network-subtitle">Mainnet</div>

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
  </Modal>
</div>

<style lang="scss">
  .icon {
    border-radius: 100px;
    width: 1.2rem;
    height: 1.2rem;
    background-color: gray;
    margin-left: 1rem;
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
    font-weight: 700;
    text-transform: uppercase;
    font-size: 80%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    opacity: 0.6;
  }
</style>
