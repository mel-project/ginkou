<script type="text/javascript">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    const close = () => {
        console.log('closing',dispatch)
        dispatch('closeModal')
    };
</script>

<template lang="pug">
    div(class="modal" on:click|self!="{close}")
        .content
            slot(close!="{close}")
</template>

<style lang="scss">
    .modal {
        position: absolute;
        z-index: 100;
        background-color: #44444444;
        width: 100vw;
        height: 100vh;
        display: grid;
        align-content: center;
        justify-content: center;
        // & > .content {
        //     width: 80vw;
        //     height: 80vh;
        //     position: relative;
        // }
    }
</style>
