<script type="text/typescript">
    import { createEventDispatcher } from "svelte";
    import Modal from "@/components/UI/windows/Modal.svelte"

    export let open = false;
    const dispatch = createEventDispatcher();

    const close = () => {
        console.log('closing',dispatch)
        dispatch('close')
    };
</script>

<template lang="pug">
+if("open")
    Modal
        div.t-dialog
            div.content
                    slot
            div.actions
                slot(name="actions")
</template>

<style lang="scss">
    .content {
        height: 70%;
        background-color: white;
        overflow: scroll;
        // align-content: center;
        // justify-content: center;
        // & > .content {
        //     width: 80vw;
        //     height: 80vh;
        //     position: relative;
        // }
    }
    .t-dialog {
        z-index: 1000;
        position:relative;
        display: flex;
        flex-direction: column;
        background: red;
    }
    .actions{
        background: blue;
    }
</style>
