
<script>
  import {createEventDispatcher} from 'svelte'

  export let items = [];
  export let stringify = (item) => item.toString()
  let _class;
  export {_class as class}


  const event_dispatcher = createEventDispatcher();

</script>

<template lang="pug">
    div(class!="menu {_class}")
      +each("items as item")
        div.item {stringify(item)}
</template>

<style lang="scss">
  @use "../../theme/_smui-theme.scss" as theme;
  .item{
    height: 3em;
    background: white;
    border-bottom: 1px solid black;
  }
</style>