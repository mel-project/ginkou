<script lang="typescript">
  import Button from "@smui/button";
  import { current_wallet, current_wallet_dump } from "@/store";
  import { add_coin } from "@/utils";
  import Snackbar, { Actions, Label } from "@smui/snackbar";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";

  const copy_wallet_handler = async () => {
    if ($current_wallet_dump) {
      const addr = $current_wallet_dump.summary.address;
      await navigator.clipboard.writeText(addr);
      alert(`copied ${addr} to clipboard`);
    }
  };

  const add_coin_handler = async () => {
    if ($current_wallet) {
      await add_coin($current_wallet, coin_id)
        .ifLeft((e) => alert(e))
        .run();
    }
  };

  let coin_id = "";
</script>

{#if $current_wallet_dump}
  <div class="container">
    <div class="box">
      <div class="box-label">Address</div>
      <div class="box-inner">{$current_wallet_dump.summary.address}</div>
      <Button class="box-button" on:click={copy_wallet_handler}>Copy</Button>
    </div>
    <div class="box">
      <div class="box-label">Add coin</div>
      <div class="box-inner">
        <Textfield bind:value={coin_id} class="box-textfield">
          <HelperText persistent slot="helper"
            >in CoinID format, e.g.
            deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef-1
          </HelperText>
        </Textfield>
      </div>
      <Button class="box-button" on:click={add_coin_handler}>Add</Button>
    </div>
  </div>
{:else}
  <p>Choose a wallet first ;)</p>
{/if}

<style>
  .container {
    width: 100%;
    flex-direction: column;
    display: flex;
    align-items: center;
  }

  .box {
    margin: 8px;
    flex-direction: row;
    display: flex;
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
