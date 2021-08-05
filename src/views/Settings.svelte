<script type="text/javascript">
  import Setting from "@/components/Setting.svelte";
  import { writable_settings as settings } from "@/store";

  $: ({ current_wallet } = settings);

  export let setting_types;

  const flatten = (settings, dependencies) => {
    // console.log(settings,dependencies)
    return !Object.entries(dependencies).reduce((reduced, dep) => {
      const dep_name = dep[0];
      const dep_value = dep[1];
      console.log(reduced, dep, settings[dep_name]);

      return reduced && settings[dep_name] == dep_value;
    }, true);
  };
</script>

<template>
  <div class="settings-menu">
    <h3>Settings</h3>
    <div class="settings-list">
      {#if $current_wallet || true}
        {#each setting_types as setting}
          {#if setting.visible != false}
            <div class="setting">
              <Setting
                bind:setting
                bind:value={$settings[setting.name]}
                disabled={setting.depends &&
                  flatten($settings, setting.depends)}
              />
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</template>

<style lang="scss">
  .settings-menu {
    display: flex;
    background: white;
    height: 100%;
    flex-direction: column;
    padding: 2em;
  }
  h3 {
    width: 100%;
    display: flex;
    justify-content: left;
  }
  .settings-list {
    padding-left: 5em;
  }
</style>
