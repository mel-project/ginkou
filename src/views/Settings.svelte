<script type="text/javascript">

import { list_wallets, get_priv_key } from "@/utils";
import { current_wallet } from "@/store";
import Button from "@smui/button";

export let networks = { Main: 255, Test: 1 };
export let show_secret_key = false;

</script>

<template>
  {#if $current_wallet}
    <Button on:click={() => (show_secret_key = !show_secret_key)}
      >Show Secret Key</Button
    >
    {#if show_secret_key}
      <div id="private-key-view">
        {#await get_priv_key($current_wallet, window.prompt("Enter password") ?? "")}
          decrypting...
        {:then sk}
          {new TextDecoder().decode(sk)}
        {:catch e}
          {e}
        {/await}
      </div>
    {/if}
  {/if}
</template>
