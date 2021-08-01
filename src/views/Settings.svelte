<script type="text/javascript">

import { list_wallets, get_priv_key } from "@/utils";
import { current_wallet } from "@/store";
import Button from "@smui/button";
import { encrypt } from "../crypto";
import { get_store_value } from "svelte/internal";
import Setting from "@/components/Setting.svelte";
import {getContext} from 'svelte';


export let setting_types;

//! assume it's possible to send an object as params
let settings = getContext("settings")

const a = (settings)=>settings.network = "helloworld"
a($settings)

</script>

<template>
  {#if $current_wallet || true}
    {Object.values($settings)}
    {#each setting_types as setting}
      <input type="text" bind:value={$settings[setting.name]} >
      <br/>
     {/each}
  {/if}
</template>
