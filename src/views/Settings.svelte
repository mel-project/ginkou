<script type="text/javascript">

import { list_wallets, get_priv_key } from "@/utils";
import { current_wallet } from "@/store";
import Button from "@smui/button";
import { encrypt } from "../crypto";
import { get_store_value } from "svelte/internal";
import Setting from "@/components/Setting.svelte";
import {getContext} from 'svelte';


export let setting_types;

let settings_context = getContext("settings") // load default settings
$settings_context = JSON.parse(localStorage.getItem("settings") ||'{}') // override defaults with local storage

//commit changes to localStorage
settings_context.subscribe((change)=>{
  // iterate over all entries in the new state
  Object.entries(change).map((item)=>{
    let name = item[0]
    let value = item[1]
    // save settings to localstorage
    localStorage.setItem("settings", JSON.stringify($settings_context))
  })
  console.log($settings_context)
})

</script>

<template>
  {#if $current_wallet || true}
    {#each setting_types as setting}
      <Setting type="text" bind:setting={setting} bind:value={$settings_context[setting.name]} ></Setting>
      <br/>
     {/each}
  {/if}
</template>
