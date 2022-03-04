<script lang="typescript">
import { createEventDispatcher, getContext } from "svelte";
import Textfield from "@/components/UI/inputs/TextField.svelte";
import Chip from "@/components/UI/Chip.svelte"
import Dialog from "@/components/UI/windows/Dialog.svelte"
import Dropdown from "@/components/UI/Dropdown.svelte";

import BigNumber from "bignumber.js";
import Button from "../components/UI/inputs/Button.svelte";
import { prepare_mel_tx, send_tx } from "../utils/utils";
import type { CoinData, Transaction } from "../utils/types";


type Contact = { name: string; address: string };

const {settings} = getContext("settings");

const { current_wallet, contacts, network } = settings
const { current_wallet_dump, wallet_summaries } = getContext("melwalletd");

// export let active_wallet: string | null;
// export let wallets: { [key: string]: WalletSummary } = {};

// Amount to send in a tx
let send_amount: string;
// Account address to send to
let search_input: string = "";
let to_addrs: Contact[] = [];

let predictions: Contact[] = [];
// Toggle confirmation window before sending a tx
let open_confirmation: boolean = false;
let prepared_tx: Transaction | null;

$: {
  predictions = search_contacts($contacts, search_input);
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
          $contacts.push({ name: "", address: search_input });
          dispatcher("sent-tx", {
            text: `Transaction initiated with hash ${JSON.stringify(txhash)}`,
          });
        })
        .run();
    }
  }
}

async function prepare_tx_handler() {
  // console.log("to_addrs", to_addrs.map((contact)=>contact.address.trim()))
  if ($current_wallet == null) {
    dsptch_err("Choose a wallet to send from");
  } else {
    if ($current_wallet_dump && $current_wallet_dump.summary.locked) {
      dsptch_err("current wallet is locked!");
    } else {
      await prepare_mel_tx($current_wallet, to_addrs.map((contact)=>contact.address.trim()), [new BigNumber(send_amount)])
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
const select_contact = (predictions: Contact[], index: number) =>{
  to_addrs = [predictions[0]]
}
const search_contacts = (contacts: Contact[], sub_name: string): Contact[] => {
  const wallet_contacts: Contact[] = Object.entries($wallet_summaries)
                                    .filter(entry=>entry[1].network==$network)
                                    .map(entry=>({name: entry[0], address: entry[1].address}))

  const predictions = [...contacts, ...wallet_contacts].filter((contact) =>
    contact.name.indexOf(sub_name) >= 0 || contact.address.indexOf(sub_name) >= 0
  );
  predictions.push({name: "unknown", address: sub_name})
  // console.log($wallet_summaries, wallet_contacts, predictions)
  return predictions;
};

const delete_addr = (index: number): Contact => {
  let temp = to_addrs.splice(index, 1)[0]; //kind of a hack. I'm assuming this is called on click therefore it exists
  to_addrs = [...to_addrs]; // used to force an update
  return temp;
};
const handle_chip_click = (index: number) => {
  search_input = delete_addr(index).address;
};
const create_chip = (contact: Contact) => {
  if(!contact.address.length) return 
  to_addrs = [...to_addrs, contact];
};
</script>

{#if prepared_tx}
  <Dialog title="Confirm Transaction"
    on:close={()=>open_confirmation=false}
    open={open_confirmation}
  >
    <div id="confirm-window">

      {#each spends(prepared_tx.outputs).filter(([address, _]) => $current_wallet_dump && address != $current_wallet_dump.summary.address) as spend}
        {console.log('spending', spend)}
        <p>Send</p>
        <div class="highlight">{spend[1]} micromel</div>
        <p>To address</p>
        <div class="highlight">{spend[0]}</div>
      {/each}

      <p>For</p>
      <div class="highlight">{prepared_tx.fee} micromel</div>

    </div>


      <div slot="actions" class="choice-buttons" let:close>
        <Button on:click={close}>Cancel</Button>
        
        <!-- Send Tx -->
        <Button
          on:click={() => {
            close()
            send_tx_handler();
          }}>Confirm</Button
        >
      </div>
  </Dialog>
{/if}

{#if $current_wallet}
  <div id="window">
    <div class="centered-container">
      
      <Textfield
        let:disabled
        let:focused
        bind:value={search_input}
        on:key_enter={() => select_contact(predictions, 0)}
        on:blur={()=> {console.log("blur");select_contact(predictions, 0)}}
        label="To:"
        disabled={to_addrs.length > 0}
        autocomplete="off"
      >
        <!-- //TODO: fix clicking  -->
       
        <Dropdown
          on:click={({detail})=> create_chip(detail.item)}
          items={predictions}
          stringify={(item) => `${item.name}: ${item.address}`}
          active={focused && !disabled}
          {disabled}
        />
      </Textfield>
      {#each to_addrs as addr, i}
        <Chip
          on:click={() => handle_chip_click(i)}
          on:remove={() => delete_addr(i)}>{addr.name}: {addr.address}</Chip
        >
      {/each}
      <Textfield
        bind:value={send_amount}
        label="Amount:"
        type="number"
        suffix="micromel"
        autocomplete="off"

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
