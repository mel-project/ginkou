<script lang="ts">


  import { getContext, createEventDispatcher } from "svelte";

    let _class: string = "";
    export {_class as class}

    const dispatcher = createEventDispatcher();

    const forwardEvent = (event: Event)=>{
        dispatcher(event.type, event)
    }
</script>

<template lang="pug">
    button(on:click class!="button mdl-button mdl-js-button buttoon--fab mdl-button--colored {_class}")
        slot
</template>

<style lang="scss">
    button:hover{
        cursor: pointer;
    }
    // .label{
    //     box-sizing: border-box;
    //     text-align: center;
    //     text-justify: center;
    //     display: flex;
    //     // height: 3em;
    //     // padding: 1em 0em;
    //     font-size: 1.2em;
    // }
</style>