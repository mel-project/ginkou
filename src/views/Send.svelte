<script lang="typescript">
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import { createEventDispatcher, getContext } from "svelte";
  import { send_tx, prepare_mel_tx, get_priv_key } from "@/utils";
  import type { WalletSummary, Transaction, CoinData } from "@/utils";
  import { get_wallet } from "@/storage";
  import Textfield from "@smui/textfield";
  import Button, { Label } from "@smui/button";
  
  const {current_wallet} = getContext("settings")
  const {current_wallet_dump} = getContext("store")

  import BigNumber from "bignumber.js";

  // export let active_wallet: string | null;
  // export let wallets: { [key: string]: WalletSummary } = {};

  // Amount to send in a tx
  let send_amount: BigNumber = new BigNumber(0);
  // Account address to send to
  let to_addr: string = "";
  // Toggle confirmation window before sending a tx
  let open_confirmation: boolean = false;
  let prepared_tx: Transaction | null;

  const dispatcher = createEventDispatcher();

  function dsptch_err(msg: any) {
    dispatcher("error", {
      text: msg,
    });
  }

  async function send_tx_handler() {
    if ($current_wallet == null) {
      dsptch_err("Choose a wallet to send from");
    } else {
      if (prepared_tx == null) {
        dsptch_err(
          'No transaction to send. This is likely a bug"' +
            $current_wallet +
            '"'
        );
      } else {
        await send_tx($current_wallet, prepared_tx)
          .ifLeft((err) => dsptch_err(err))
          .ifRight((txhash) => {
            dispatcher("sent-tx", {
              text: `Transaction initiated with hash ${JSON.stringify(txhash)}`,
            });
          })
          .run();
      }
    }
  }

  async function prepare_tx_handler() {
    if ($current_wallet == null) {
      dsptch_err("Choose a wallet to send from");
    } else {
      if ($current_wallet_dump && $current_wallet_dump.summary.locked) {
        dsptch_err("current wallet is locked!");
      } else {
        await prepare_mel_tx($current_wallet, to_addr, send_amount)
          .ifLeft((err) => dsptch_err(err))
          .ifRight((tx) => {
            open_confirmation = true;
            prepared_tx = tx;
          })
          .run();
      }
    }
  }

  // Get a list of (covhash,amount) pairs from a list of outputs
  function spends(outputs: CoinData[]): [string, BigNumber][] {
    return outputs.map((cd) => [cd.covhash, cd.value]);
  }
</script>

{#if prepared_tx}
  <Dialog
    bind:open={open_confirmation}
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
  >
    <div id="confirm-window">
      <h1>Confirm Transaction</h1>

      {#each spends(prepared_tx.outputs).filter(([address, _]) => $current_wallet_dump && address != $current_wallet_dump.summary.address) as spend}
        <p>Send</p>
        <div class="highlight">{spend[1]} micromel</div>
        <p>To address</p>
        <div class="highlight">{spend[0]}</div>
      {/each}

      <p>For</p>
      <div class="highlight">{prepared_tx.fee} micromel</div>

      <div class="choice-buttons">
        <Button on:click={() => (open_confirmation = false)}>Cancel</Button>

        <!-- Send Tx -->
        <Button
          on:click={() => {
            open_confirmation = false;
            send_tx_handler();
          }}>Confirm</Button
        >
      </div>
    </div>
  </Dialog>
{/if}

{#if $current_wallet}
  <div id="window">

    <Textfield bind:value={to_addr} label="To" />
    <Textfield
      bind:value={send_amount}
      label="Amount"
      type="number"
      suffix="micromel"
    />

    <Button on:click={prepare_tx_handler}>Send</Button>
        
  </div>
{:else}
  <p>Choose a wallet first ;)</p>
{/if}

<style>
  #window {
    display: flex;
    flex-direction: column;
    max-width: 40em;
    justify-content: center;
  }
  #confirm-window {
    display: flex;
    padding: 10px;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .highlight {
    font-weight: bold;
  }

  .choice-buttons {
    display: flex;
    justify-content: center;
  }
</style>
