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

console.log(settings)

$settings = JSON.parse(localStorage.getItem("settings") ||'{}') // override defaults with local storage

settings.subscribe((change)=>{
  let p_settings = localStorage.getItem("settings") || {}
  console.log(p_settings)
  Object.entries(change).map((item)=>{
    let name = item[0]
    let value = item[1]
    settings[name] = value
    localStorage.setItem("settings", JSON.stringify(settings))
  })
})

</script>

<template>
  {#if $current_wallet || true}
    {#each setting_types as setting}
      <input type="text" bind:value={$settings[setting.name]} >
      <br/>
     {/each}
  {/if}
</template>
