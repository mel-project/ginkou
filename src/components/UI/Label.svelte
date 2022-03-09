<script lang="ts">
    let _class: string = "";
    export {_class as class}
</script>

<template lang="pug">
    div(class!="label {_class}")
        div
            slot
</template>

<style lang="scss">
    .label{
        box-sizing: border-box;
        text-align: center;
        text-justify: center;
        display: flex;
        // height: 3em;
        // padding: 1em 0em;
        font-size: 1.2em;
    }
</style>