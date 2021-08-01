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
console.log($settings.network)

const a = (settings)=>settings.network = "helloworld"
a($settings)

console.log($settings.network)
// let value = settings[setting.name]
console.log('hello')
const changeSetting = (result, setting) => {
  console.log(setting, result)
}
</script>

<template>
  {#if $current_wallet || true}
    {#each Object.entries(settings) as setting}
      <input type="text" on:change={(ev) => changeSetting(ev, setting)}>
     {/each}
  {/if}
</template>
