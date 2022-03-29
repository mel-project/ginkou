<script lang="ts">
import Setting from "../components/Setting.svelte";
import Select from "../components/UI/inputs/Select.svelte"
import Button from "../components/UI/inputs/Button.svelte"
import BooleanInput from "../components/UI/inputs/Boolean.svelte"

import {persistent_tabs, default_tab} from "../stores"

// import Settings from "../stores";



</script>

<template>
  <div class="settings-menu">
    <div class="top"></div>
    <div class="title">
      <h1>Settings</h1>
    </div>
    <div class="container">
      <div class="settings-list">

        <Setting name="Persistent Tabs" label="Persistent Tabs" 
          description="Save and reload the previous tab on page refresh">
          <BooleanInput bind:value={$persistent_tabs}/>
        </Setting>
        
        <Setting name="Default Tab" label="Default Tab"
        description="The tab to load on page startup (not available with persistent tabs)">
          <Select disabled={$persistent_tabs} bind:value={$default_tab} options={[["Home",0], ["Transactions",1], ["Settings",2]]}></Select>
        </Setting>

      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use "../res/styles/theme.scss" as theme;
  .top {
    height: 2em;
    width: 100%;
    margin-bottom: 1em;
    background-color: theme.$primary;
  }
  .settings-menu {
    display: flex;
    background: white;
    height: 100%;
    flex-direction: column;
    .container {
      padding: 2em 2em;
      padding-top: 0em;
    }
  }
  .title{
    border-bottom: solid 2px theme.$primary;
    h1{
      padding: 1em;
      font-weight: 700;
    }
    margin-bottom: 1em;
  }
</style>
