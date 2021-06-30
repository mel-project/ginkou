<script>
  import {onMount} from 'svelte'
  export let tabs = []
  export let active_tab = tabs[0]
  const refs = []
  let active_index = tabs.indexOf(active_tab)
  
</script>

<template lang="pug">
    div
      ul.tabs
        +each("tabs as tab, i")
          li.tab-button(class:active!="{active_tab == tab}"
          on:click!="{()=>{active_tab = tab; active_index = i;}}")
            slot({tab}) {tab}
      hr(style!="width: calc({100/tabs.length}% - 2px); margin-left: {100/tabs.length * active_index}%") 
</template>

<style lang="scss">
  @use "../../theme/_smui-theme.scss" as theme;
  ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .tabs{
    display: flex;
    
  }
  hr{
    padding: 0;
    margin: 0;
    transition: .3s ease-in-out;
    background-color: theme.$primary;
  }
</style>