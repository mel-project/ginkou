<script lang="typescript">
import type { WalletSummary } from "./utils";



  export let name: string;
  export let wallet: WalletSummary;
  export let selected: boolean;
</script>

<div class={!selected ? "wallet-menu-item" : "wallet-menu-item-selected"}>
  <div class="wallet-name">{name}</div>
  <div class="wallet-balance">{wallet.total_micromel} µMEL</div>
</div>

<style>
  .wallet-menu-item {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .wallet-menu-item-selected {
    background-color: #f2f7f2;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
  }
  .wallet-name {
    font-size: 120%;
    font-weight: 500;
  }
  .wallet-balance {
    font-size: 90%;
    font-weight: 500;
    opacity: 0.5;
  }
</style>
