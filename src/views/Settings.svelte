<script type="text/typescript">
  import SettingComp from "@/components/Setting.svelte";
  import type {Settings, Setting} from "@/store";
  import type { Readable } from "svelte/store";


  interface NamedObject {
    name: string;
    setting: {[key: string]: Setting};
  }

  export let setting_types: Settings<Setting>;
  export let settings: Settings<Readable<string>>;
  export let writable_settings: Readable<Settings<string>>;
  

  console.log(settings)

  const NamedEntries = (obj: {[key: string]: Setting}): [NamedObject] => {

    const named_entries = Object.entries(obj).map((entry) => {
      const name: string = entry[0];
      const setting:Setting =  entry[1];
      return {name, setting};
    })
    return named_entries as unknown as [NamedObject];
  }
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
          {#each NamedEntries(setting_types) as {name, setting}}
            {#if setting.visible != false}
              <div class="setting">
                <SettingComp
                  bind:setting
                  {name}
                  bind:value={$writable_settings[name]}
                  disabled={setting.depends &&
                    check_matching_dependencies($writable_settings, setting.depends)}
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
    height: 2em;
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
