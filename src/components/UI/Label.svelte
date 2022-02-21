<script lang="typescript">
    let _class: string = "";
    export {_class as class}
</script>

<template lang="pug">
    div(class!="label {_class}")
        h3
            slot
</template>

<style lang="scss">
    .label{
        text-align: center;
        text-justify: center;
        display: flex;
        height: 100%;
    }
</style>