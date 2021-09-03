<script lang="typescript">
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import { createEventDispatcher, getContext } from "svelte";
  import { send_tx, prepare_mel_tx, get_priv_key } from "@/utils";
  import type { WalletSummary, Transaction, CoinData } from "@/utils";
  import { get_wallet } from "@/storage";
  import Textfield from "@/components/UI/TextField.svelte";
  import Chip from "@/components/UI/Chip.svelte";
  import Dropdown from "@/components/UI/Dropdown.svelte";
  import Button, { Label } from "@smui/button";

  type Contact = { name: string; address: string };

  const { current_wallet, contacts, writable_settings } =
    getContext("settings");
  const { current_wallet_dump, wallet_summaries } = getContext("store");

  import BigNumber from "bignumber.js";
  import { length } from "json-bigint";
  import { append } from "svelte/internal";
  import App from "../App.svelte";
  import Contacts from "./Contacts.svelte";

  // export let active_wallet: string | null;
  // export let wallets: { [key: string]: WalletSummary } = {};

  // Amount to send in a tx
  let send_amount: BigNumber = new BigNumber(0);
  // Account address to send to
  let to_addr: string = "";
  let to_addrs: Contact[] = [];

  let predictions: Contact[] = [];
  let selected_prediction: Contact;
  // Toggle confirmation window before sending a tx
  let open_confirmation: boolean = false;
  let prepared_tx: Transaction | null;

  $: {
    predictions = search_names($contacts, to_addr);
  }

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
            $writable_settings.contacts.push({ name: "", address: to_addr });
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

  const search_names = (contacts: Contact[], sub_name: string): Contact[] => {
    if (sub_name == "") return [];
    const prediction = contacts.filter((contact) =>
      contact.name.startsWith(sub_name)
    );
    if (prediction) {
      return prediction;
    } else {
      return [];
    }
  };

  const delete_addr = (index: number): Contact => {
    let temp = to_addrs.splice(index, 1)[0]; //kind of a hack. I'm assuming this is called on click therefore it exists
    to_addrs = [...to_addrs];
    return temp;
  };
  const handle_chip_click = (index: number) => {
    to_addr = delete_addr(index).address;
  };
  const create_chip = (contact: Contact) => {
    to_addrs = [...to_addrs, contact];
  };
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
    <div class="centered-container">
      {#each to_addrs as addr, i}
        <Chip
          on:click={() => handle_chip_click(i)}
          on:remove={() => delete_addr(i)}>{addr.name}: {addr.address}</Chip
        >
      {/each}
      <Textfield
        bind:value={to_addr}
        on:blur={() => {
          selected_prediction && create_chip(selected_prediction || { name: "", address: to_addr });
          to_addr = "";
        }}
        on:key_enter={() => create_chip(predictions[0])}
        label="To:"
      >
        <Dropdown
          bind:hovered={selected_prediction}
          items={predictions}
          stringify={(item) => `${item.name}: ${item.address}`}
        />
      </Textfield>
      <Textfield
        bind:value={send_amount}
        label="Amount:"
        type="number"
        suffix="micromel"
      />
  
      <Button on:click={prepare_tx_handler}>Send</Button>
    </div>
  </div>
{:else}
  <p>Choose a wallet first ;)</p>
{/if}

<style>
  #window {
    display: flex;
    flex-direction: row;
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
  .search-menu {
    position: absolute;
    z-index: 100;
    width: 100%;
  }
  .centered-container {
    width: 40em;
  }
</style>
