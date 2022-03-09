<script lang="ts">
  import Button from "@/components/UI/inputs/Button.svelte";
  import Textfield from "@/components/UI/inputs/TextField.svelte";
  import { getContext, createEventDispatcher } from "svelte";
import { add_coin, tap_faucet, TESTNET } from "../utils/utils";

  const {settings} = getContext("settings")
  const {current_wallet} = settings
  const {current_wallet_dump} = getContext("melwalletd")

  const dispatcher = createEventDispatcher();

  const copy_wallet_handler = async () => {
    if ($current_wallet_dump) {
      const addr = $current_wallet_dump.summary.address;
      await navigator.clipboard.writeText(addr);
      dispatcher("notify-banner", {text: `copied to clipboard`})
    }
  };
  const add_coin_handler = async () => {
    if ($current_wallet) {
      await add_coin($current_wallet, coin_id)
        .ifLeft((e) => alert(e))
        .run();
    }
  };
  const tap_faucet_handler = async () => {
    if ($current_wallet) {
      await tap_faucet($current_wallet)
        .ifLeft((e) => alert(e))
        .run();
    }
  };
  let coin_id = "";
</script>

{#if $current_wallet_dump}
  <div class="container">
    <div class="box row">
      <div class="box-label">Address</div>
      <div class="box-inner flex-text">{$current_wallet_dump.summary.address}</div>
      <Button class="box-button" on:click={copy_wallet_handler}>Copy</Button>
    </div>
    <div class="box column">
      <div class="row">
        <div class="box-label">Add coin</div>
        <div class="flex-text box-inner">
          <Textfield bind:value={coin_id} class="box-textfield" />
          <!-- <HelperText persistent slot="helper"
          >in CoinID format, e.g.
          deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef-1
        </HelperText> -->
        </div>
        <Button class="box-button" on:click={add_coin_handler}>Add</Button>
      </div>
    </div>
    {#if $current_wallet_dump.summary.network == TESTNET}
      <Button on:click={tap_faucet_handler}>Tap Faucet</Button>
    {/if}
  </div>
{:else}
  <p>Choose a wallet first ;)</p>
{/if}

<style>
  .row{
    display: flex;
    flex-direction: row !important;
  }
  .column{
    display: flex;
    flex-direction: column !important;
  }
  .container {
    width: 100%;
    flex-direction: column;
    display: flex;
    align-items: center;
  }

  .box {
    margin: 8px;
    max-width: 100%;
    border: black solid 1px;
    border-radius: 4px;
    padding: 8px;
    margin: 8px;
    background-color: white;
    flex-basis: content;
    align-items: center;
  }

  .box-label {
    margin-right: 8px;
    font-weight: 400;
  }

  .flex-text, .flex-text :global(.box-textfield){ 
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }
  .box-inner {
    opacity: 0.8;
  }

  * :global(.box-button) {
    margin: 0 !important;
  }

  * :global(.box-textfield) {
    height: 42px;
    min-width: 500px;
  }
</style>
