<script type="text/typescript">
    import { createEventDispatcher } from "svelte";
    import Modal from "@/components/UI/windows/Modal.svelte"

    export let open = false;
    export let title = "Transaction Summary"
    const dispatch = createEventDispatcher();

    const close = () => {
        console.log('requesting: close dialog')
        dispatch('close')
    };
</script>

<template lang="pug">
+if("open")
    Modal(on:close!="{close}")
        div.t-dialog
            h2.title {title}
            div.content
                    slot
            div.actions
                slot( {close} name="actions")
</template>

<style lang="scss">
    .t-dialog {
        z-index: 1000;
        position:relative;
        display: flex;
        flex-direction: column;
        background: white;
        height: 50%;
        width: 50%;
        // top: 50%;
        // left: 50%;
        padding: 1em;
        box-sizing: border-box;
  /* bring your own prefixes */
        transform: translate(50%, 50%);
        overscroll-behavior: none;
    }
    .content {
        position:relative;
        background-color: white;
        overflow-y: scroll;
        overflow-x: wrap;
        overscroll-behavior: none;
        max-height: inherit;
        scrollbar-width: none;
        &::-webkit-scrollbar{
            display: none
        }
        // align-content: center;
        // justify-content: center;
        // & > .content {
        //     width: 80vw;
        //     height: 80vh;
        //     position: relative;
        // }
    }

    .actions{
        // background: blue;
        padding-top: 1em;
        border-top : solid 1px green;
        display: flex;
        flex-flow: reverse;
        justify-content: right;
        overscroll-behavior: none;

    }
</style>
