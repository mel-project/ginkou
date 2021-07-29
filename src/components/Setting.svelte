<script type="text/javascript">

import { list_wallets, get_priv_key } from "@/utils";
import { current_wallet } from "@/store";
import Button from "@smui/button";
import { encrypt } from "../crypto";
import { get_store_value } from "svelte/internal";



// assume it's possible to send an object as params
export let setting = {}
export let value;
</script>

<template>  
    {setting.type}
    {#if setting.type == "select"}
        <!-- <select name="" id="">
            {#each Object.enctries(setting.options) as option}
                <option>
                    {option[0]},{option[1]}
                </option>
            {/each} 
        </select> -->
    {:else}
       <input type="{setting[0]}" noChange="{
           (event) => {
               value = event.target.value;
           }
       }"> 
    {/if}

</template>