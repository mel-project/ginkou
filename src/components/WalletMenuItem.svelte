<script lang="typescript">
  import { lock_wallet } from "@/utils";
  import type { WalletSummary } from "@/utils";

  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import WalletUnlocker from "./WalletUnlocker.svelte";

  export let name: string;
  export let wallet: WalletSummary;
  export let selected: boolean;

  let unlocker_open = false;
</script>

<div class={!selected ? "wallet-menu-item" : "wallet-menu-item-selected"}>
  <div class="wallet-name">{name}</div>
  <div class="wallet-balance">{wallet.total_micromel} µMEL</div>
  <div
    class="lock-status" class:locked="{wallet.locked}"
    on:click={async () => {
      if (wallet.locked) {
        unlocker_open = true;
      } else {
        console.log("unlocking");
        await lock_wallet(name).ifLeft(alert).run();
      }
    }}
  >
    {wallet.locked ? "locked" : "unlocked"}
  </div>
  <WalletUnlocker bind:name bind:open={unlocker_open} />
</div>

<style type="text/scss">
  @use "../theme/_smui-theme.scss" as theme;

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
