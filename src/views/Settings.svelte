<script type="text/javascript">

import { list_wallets, get_priv_key } from "@/utils";
import { current_wallet } from "@/store";
import Button from "@smui/button";
import { encrypt } from "../crypto";
import { get_store_value } from "svelte/internal";
import Setting from "@/components/Setting.svelte";

//! assume it's possible to send an object as params
export let settings;


</script>

<template>
  {#if $current_wallet || true}
    {#each settings as setting}
      <Setting bind:setting>
      </Setting>
     {/each}
  {/if}
</template>
