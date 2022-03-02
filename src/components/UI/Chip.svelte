<script>
  import {createEventDispatcher} from 'svelte'

  export let value = ""
  export let label = ""

  let _class;
  export {_class as class}


  const event_dispatcher = createEventDispatcher();

  const handleKeyPress = (evt) => {
    if(evt.key == "Enter") event_dispatcher("key_enter")
    else if(evt.key == "Tab") event_dispatcher("key_tab")
  }
</script>

<template lang="pug">
    span(class!="chip {_class}" on:click on:blur on:focus)
        div.name
          slot()
        div.close(on:click!="{()=>event_dispatcher('remove')}") X
</template>

<style lang="scss">
  @use "../../styles/theme.scss" as theme;
  .chip{
    user-select: none;
    background-color:  theme.$secondary;
    border-radius: 3em;
    padding: .4em 1.5em;
    padding-left: .5em;
    display: flex;
    justify-content:space-between;
    margin: .1em;
    // transition: border-color 300ms cubic-bezier(.52,.23,.13,.93);
    // border-bottom: 3px solid theme.$primary;
  }
  .chip:hover{
    background-color: darken(theme.$secondary, 10%);
  }
  .content{
    display: flex;
    justify-content: space-between;
  }

  .close{
    border-radius: 10em;
    background-color: #66666666;
    padding: .2em .5em;
    &:hover{
      cursor: pointer;
    }
  }
</style>