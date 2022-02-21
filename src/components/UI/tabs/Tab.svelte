<script lang="typescript">
    export let tab: string;
    let _class: string = "";
    export {_class as class}
</script>

<template lang="pug">
    div(class!="tab {_class}")
        slot(item!="{tab}") {tab}
</template>

<style lang="scss">
    .tab{
        text-align: center;
        text-justify: center;
    }
</style>