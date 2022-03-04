<script lang="typescript">
  import { createEventDispatcher } from "svelte";
  import { new_wallet } from "../utils/utils";

  import Button from "@/components/UI/inputs/Button.svelte";
  import TextField from "@/components/UI/inputs/TextField.svelte";

  export let networks: any;
  export let active_net: number;

  // Name of new wallet to be created
  let new_wallet_name: string = "";
  // Message to user on successful wallet creation
  let create_wallet_result: string | null = null;

  const dispatcher = createEventDispatcher();

  function dispatch_failure(err: any) {
    dispatcher("error", {
      text: err,
    });
  }

  // Create a wallet and store the result on success, emit an event on failure
  async function handle_create_wallet(wallet_name: string) {
    const password = window.prompt("Choose a password") ?? "";

    let res = await new_wallet(
      new_wallet_name,
      active_net == networks["Test"] ? true : false,
      password
    )
      .ifLeft((err) => dispatch_failure(err))
      .run();
  }
</script>

<div class="create-wallet-view">
  <TextField bind:value={new_wallet_name} label="Wallet name" />

  <Button on:click={() => handle_create_wallet(new_wallet_name)}>
    Create wallet
  </Button>
</div>

{#if create_wallet_result != null}
  <p>{create_wallet_result}</p>
{/if}

<style>
  .create-wallet-view {
    display: flex;
    flex-direction: column;
  }
</style>
