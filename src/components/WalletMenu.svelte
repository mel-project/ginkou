<script lang="typescript">
import WalletMenuItem from "@/components/WalletMenuItem.svelte";
import TextField from "./UI/inputs/TextField.svelte"
import Button from "@/components/UI/inputs/Button.svelte";
import {getContext} from 'svelte';
import type {Readable} from 'svelte/store'
import WalletUnlocker from "./WalletUnlocker.svelte";
import Dialog from "./UI/windows/Dialog.svelte";
import { TESTNET } from "../utils/utils";
import type { WalletSummary } from "../utils/types";

type Summaries = Readable<{[key: string]: WalletSummary}>;

const {wallet_summaries}: {wallet_summaries: Summaries} = getContext("melwalletd");
const {settings} = getContext("settings");
const {network, current_wallet} = settings
console.log($network)
// wallet_summaries.subscribe(console.log)
let add_new_open = false; 
let new_name = "";
let new_password = "";
let new_network = $network == TESTNET;
let unlocking_wallet: any;
const raise_err = (err: any) => {
  alert(err); // replace with something decent
};

const create_wallet_callback = async () => {
  // validate name
  if (!new_name) {
    raise_err("wallet name cannot be empty");
  } else {
    // we try now
    await new_wallet(new_name, new_network, new_password)
      .ifLeft(raise_err)
      .ifRight((_) => {
        add_new_open = false;
        new_name = "";
        new_password = "";
      }).run();



  }
};
const open_unlocker = ({detail}: any)=>{
  unlocking_wallet=detail;
}
</script>

<div id="wallet-menu-inner">
  
  {#each Object.entries($wallet_summaries) as [wlt, wlt_content]}
   {#if $network == 0 || wlt_content.network == $network}
      <div class="menu-item" on:click={() => {
          $current_wallet = wlt
        }
        }>
        <WalletMenuItem
          name={wlt}
          wallet={wlt_content}
          selected={wlt === $current_wallet}
          on:unlock={open_unlocker}
        />
      </div>
    {/if}
  {/each}
  <div class="menu-item">
    <div class="wallet-add-new">
      <Button on:click={() => (add_new_open = true)}>
        <div class="material-icons">add</div>
        <div>Create wallet</div>
      </Button>
    </div>
  </div>
</div>

<WalletUnlocker on:close={()=>unlocking_wallet={}} name={unlocking_wallet?.name} />
<Dialog title="Create New Wallet" on:close={()=>add_new_open = false} bind:open={add_new_open}>
    
    <div style="margin: 10px">
      <TextField variant="outlined" bind:value={new_name} label="Name">
      </TextField>
      <TextField
        type="password"
        variant="outlined"
        bind:value={new_password}
        label="Password"
      >
      </TextField>
    </div>
    <svelte:fragment slot="actions">
    <div style="text-align: right">
      <span>
        <label for="testnet-checkbox" style="display: inline">Testnet: </label>
        <input name="testnet-checkbox" type="checkbox" bind:checked="{new_network}">
      </span>
        <Button variant="outlined" on:click={create_wallet_callback}>
          <div>OK</div>
        </Button>
      </div>
    </svelte:fragment>
</Dialog>

<style type="text/scss">
  @use '../res/styles/theme.scss' as theme;
  #wallet-menu-inner{
    overflow: hidden;
    overflow-y: scroll;
    height: calc(100vh - 5em);
    direction: rtl;
    scrollbar-color: theme.$primary white;
  }
  .menu-item {
    direction: ltr;
  }

  .wallet-add-new {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    position: relative;
  }
</style>
