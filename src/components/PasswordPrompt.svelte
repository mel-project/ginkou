<script lang="ts">
	import TextField from './UI/inputs/TextField.svelte';
import { createEventDispatcher } from "svelte";
import { currentWalletName, currentWalletSummary } from "../stores";
import { ensure_unlocked, WaitableEvent } from "../utils/utils";
import RoundButton from "../components/RoundButton.svelte";
let password="";


export let try_unlock = (password: string) =>{
    if($currentWalletName && $currentWalletSummary){
        ensure_unlocked($currentWalletName, $currentWalletSummary, password);
    }
}


</script>

<template>
    <div class="content">
        <div class="logo">
            <img src="images/logo-only.png" alt="" srcset="">
        </div>
        <TextField bind:value={password} label="password: " class="underlined"></TextField>
        <div class="unlock-wrapper">
            <div class="unlock">
                <RoundButton on:click={(x)=>try_unlock(password)} fill>Unlock</RoundButton>
            </div>
    
        </div>
    </div>
</template>

<style lang="scss">
    .logo{
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 5em;
        margin-bottom: 3em; 
    }
    .logo img{
        height: 7em;
    }
    .content{
        display: flex;
        flex-direction: column;
        gap: 1em;
        height: 50%;
        justify-content: center;
    }
    .unlock-wrapper{
        display: flex;
        justify-content: space-around;
    }
    .unlock{
        width: 90%;
        height: 3rem;
    }
</style>
