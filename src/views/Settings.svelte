<script type="text/javascript">
  import Setting from "@/components/Setting.svelte";
  import { writable_settings as settings } from "@/store";


  export let setting_types;

  const check_matching_dependencies = (settings, dependencies) => {
    // console.log(settings,dependencies)
    return !Object.entries(dependencies).reduce((reduced, dep) => {
      const dep_name = dep[0];
      const dep_value = dep[1];
      return reduced && settings[dep_name] == dep_value;
    }, true);
  };
</script>

<template>
  <div class="settings-menu">
    <div class="top"></div>
    <div class="container">
      <h3>Settings</h3>
      <div class="settings-list">
          {#each setting_types as setting}
            {#if setting.visible != false}
              <div class="setting">
                <Setting
                  bind:setting
                  bind:value={$settings[setting.name]}
                  disabled={setting.depends &&
                    check_matching_dependencies($settings, setting.depends)}
                />
              </div>
            {/if}
          {/each}
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @use "../theme/_smui-theme.scss" as theme;
  .top{
    height: 3em;
    width:100%;
    background-color: theme.$primary;

  }
  .settings-menu {
    display: flex;
    background: white;
    height: 100%;
    flex-direction: column;
    .container{
      padding: 2em 2em;
      padding-top: 0em;
    }
  }
  h3 {
    width: 100%;
    display: flex;
    justify-content: left;
  }
  .settings-list {
    // padding-left: 5em;
  }
</style>
