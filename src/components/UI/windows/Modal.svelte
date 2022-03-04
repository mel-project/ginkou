<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    export const close = () => {
        dispatch('closeModal')
        dispatch('close')
    };
</script>

<template lang="pug">
    div(class="modal" on:click|self!="{close}")
        slot()
</template>

<style lang="scss">
    .modal {
        position: absolute;
        z-index: 999;
        background-color: #44444444;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        display: grid;
        // align-content: center;
        // justify-content: center;
        // & > .content {
        //     width: 80vw;
        //     height: 80vh;
        //     position: relative;
        // }
    }
</style>
