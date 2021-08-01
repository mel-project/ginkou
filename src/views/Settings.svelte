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

// let settings = $settings
// console.log(settings)
// commit changes to localStorage
// settings.subscribe((change)=>{
//   // iterate over all entries in the new state
//   Object.entries(change).map((item)=>{
//     let name = item[0]
//     let value = item[1]
//     $settings[name] = value
//     // save settings to localstorage
//     localStorage.setItem("settings", JSON.stringify($settings))
//   })
//   console.log($settings)
// })

</script>

<template>
  {#if $current_wallet || true}
    {#each setting_types as setting}
      <!-- <input type="text" bind:value={$settings[setting.name]} >  -->
      <br/>
     {/each}
  {/if}
</template>
