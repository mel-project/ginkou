<script type="text/typescript">
  import SettingComp from "@/components/Setting.svelte";
  import type {State, SettingConfig, Obj} from "@/store";
  import type { Writable, Readable, readable} from "svelte/store";


  interface NamedObject {
    name: string;
    setting: {[key: string]: SettingConfig};
  }

  export let setting_types: State<SettingConfig>;
  export let settings: State<Writable<any>>;
  // export let writable_settings: Readable<Settings<string>>;
  let {network, persistent_tabs, default_tab, current_wallet, active_tab} = settings

  // this is a hack
  // basically without this svelte has no way of knowing a list of stores is passed to the Setting component
  // so it doesn't make that component reactive to a change in `settings`
  // the code below takes advantage of computed properties ability to update components (checkout the disabled property)
  // this is very fragile to changes in settings
  // adding a new setting can sometimes break this
  $: all_settings = [$network, $persistent_tabs, $default_tab, $current_wallet, $active_tab]

  const NamedEntries = (obj: State<SettingConfig>): [NamedObject] => {

    const named_entries = Object.entries(obj).map((entry) => {
      const name: string = entry[0];
      const setting:SettingConfig =  entry[1];
      return {name, setting};
    })
    return named_entries as unknown as [NamedObject];
  }
  const get_store_value = (store: any) => {
    let value;
    store.subscribe((v:any)=> value = v)()
    return value;
  }
  const check_matching_dependencies = (settings: State<Readable<any>>, dependencies: Obj<string | number | boolean>) => {
    return !Object.entries(dependencies).reduce((reduced, dep) => {
      const dep_name = dep[0];
      const dep_value = dep[1];
      let setting_value = get_store_value(settings[dep_name])
      return reduced && setting_value == dep_value;
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
                  on:change={({detail})=>settings[name].set(detail.value)}
                  disabled={all_settings && setting.depends &&
                    check_matching_dependencies(settings, setting.depends)}
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
