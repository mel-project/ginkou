<script>
  export let tabs = []
  export let active_tab = tabs[0]
  let active_index = tabs.indexOf(active_tab)
</script>

<template lang="pug">
    div
      ul.tabs
        +each("tabs as tab, i")
          li.tab-button(class:active!="{active_tab == tab}"
          on:click!="{()=>{active_tab = tab; active_index = i;}}")
            slot({tab}) {tab}
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
  li{
    border-bottom: 0px;
    width: 100%;

  }
  .active{
    border-bottom: 3px solid theme.$primary;
  }
</style>