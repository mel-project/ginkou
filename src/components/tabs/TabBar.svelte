<script>
  import {onMount} from 'svelte'

  export let tabs = []
  export let tab_elements = {}
  export let active_tab = tabs[0]
  let active_index = tabs.indexOf(active_tab)
  let mounted = false;

  const getWidth = (tab) => {
    if(!tab_elements[tab]) return 0
    return tab_elements[tab].getElement().clientWidth
  }
  const getOffset = (tab) => {
    const index = tabs.indexOf(tab)
    console.log(Object.keys(tab_elements).slice(0,index).map(getWidth))
    return Object.keys(tab_elements).slice(0,index).map(getWidth).reduce((i,j)=>i+j,0)
  }
  onMount(()=>{
    mounted = true
    // console.log(getOffset("Transactions"))
  })
</script>

<template lang="pug">
    div
      ul.tabs
        +each("tabs as tab, i")
          li.tab-button(class:active!="{active_tab == tab}"
          on:click!="{()=>{active_tab = tab; active_index = i;}}")
            slot({tab} {i}) {tab}
      +if("mounted")
        hr(style!="width: calc({getWidth(active_tab)}px - 2px); margin-left: {getOffset(active_tab)}px") 
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