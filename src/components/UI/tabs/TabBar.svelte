<script lang="typescript">
  export let tabs: string[] = []
  export let active_tab = tabs[0]
  let _class: string = "";
  export {_class as class}
  let active_index = tabs.indexOf(active_tab)
</script>

<template lang="pug">
    div(class!="{_class}")
      ul.tabs
        +each("tabs as tab, i")
          li.tab-button(class:active!="{active_tab == tab}"
          on:click!="{()=>{active_tab = tab; active_index = i;}}")
            slot({tab}) {tab}
</template>

<style lang="scss">
  @use "../../../theme/_smui-theme.scss" as theme;
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
    transition: 60ms ease;
    &:hover{
      border-bottom: 3px solid theme.$secondary;
    }
  }
  li.active{
    // background:  lighten(theme.$secondary, 10%);
    transition: border-color 300ms cubic-bezier(.52,.23,.13,.93);
    border-bottom: 3px solid theme.$primary;
  }
</style>