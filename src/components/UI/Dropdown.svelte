
<script>
  import {createEventDispatcher} from 'svelte'

  export let items = [];
  export let stringify;
  export let hovered;

  // edge case:
  // hovered element is destroyed never calling `mouseleave` 
  // hovered == item, even when the item is gone
  $: {
    // on changes to items, make sure the hovered item still exists
    if(!items.includes(hovered)){
      hovered = undefined
    }
  }
  let _class;
  export {_class as class}


  const event_dispatcher = createEventDispatcher();

</script>

<template lang="pug">
    div(class!="menu {_class}" tabindex="-1")
      +each("items as item")
        div.item(
          on:mouseenter!="{()=>{hovered=item}}"
          on:mouseleave!="{()=>{hovered=undefined}}"
        on:click!="{()=>event_dispatcher('click', {item})}") {stringify(item)}
</template>

<style lang="scss">
  @use "../../theme/_smui-theme.scss" as theme;
  .item{
    height: 3em;
    background: white;
  }
  .menu{
    max-height: 20em;
    overflow-y: scroll;

  }
  .item:hover{
    background: #DDDDDD;
    cursor: pointer;
  }
</style>