<script type="text/javascript">

import { list_wallets, get_priv_key } from "@/utils";
import { current_wallet } from "@/store";
import Button from "@smui/button";
import { encrypt } from "../crypto";
import { get_store_value } from "svelte/internal";
import Setting from "@/components/Setting.svelte";
import {getContext} from 'svelte';

//! assume it's possible to send an object as params
let settings = getContext("settings")
console.log(settings)
// let value = settings[setting.name]


</script>

<template>
  {#if $current_wallet || true}
    {#each Object.entries($settings) as setting}
      {setting}
     {/each}
  {/if}
</template>
