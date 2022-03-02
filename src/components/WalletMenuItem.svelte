<script lang="typescript">
  import { lock_wallet } from "@/utils";
  import type { WalletSummary } from "@/utils";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let name: string;
  export let wallet: WalletSummary;
  export let selected: boolean;

  const dispatch_unlock = () => {
    dispatch('unlock',{name, wallet, selected})
  };


</script>

<div class={!selected ? "wallet-menu-item" : "wallet-menu-item-selected"}>
  <div class="wallet-name">{name}</div>
  <div class="wallet-balance">{wallet.total_micromel} µMEL</div>
  <div
    class="lock-status" class:locked="{wallet.locked}"
    on:click={async () => {
      if (wallet.locked) {
        console.log('dispatching unlock')
        dispatch_unlock();
      } else {
        await lock_wallet(name).ifLeft(alert).run();
      }
    }}
  >
    {wallet.locked ? "locked" : "unlocked"}
  </div>
</div>

<style type="text/scss">
  @use "../styles/theme.scss" as theme;

  .wallet-menu-item {
    padding: 10px;
    position: relative;
  }
  .wallet-menu-item-selected {
    background-color: #f2f7f2;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 20px;
    position: relative;
  }
  .wallet-name {
    font-size: 120%;
    font-weight: 500;
    max-width: 5em;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .wallet-balance {
    font-size: 90%;
    font-weight: 500;
    opacity: 0.5;
  }

  .lock-status {
    position: absolute;
    top: 0px;
    right: 0px;
    border: 1px solid black;
    margin: 8px;
    padding: 3px;
    border-radius: 8px;
    font-size: 75%;
    font-weight: 500;
    transition: background-color .9s cubic-bezier(0.075, 0.82, 0.165, 1);

  }
  .lock-status:hover{
    background: theme.$primary;
    cursor: pointer;
    color: white;
  }
</style>
