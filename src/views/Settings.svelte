<script lang="ts">
  import Setting from "../components/Setting.svelte";
  import Select from "../components/UI/inputs/Select.svelte";
  import Button from "../components/UI/inputs/Button.svelte";
  import BooleanInput from "../components/UI/inputs/Boolean.svelte";

  import { persistent_tabs, default_tab } from "../stores";

  // import Settings from "../stores";
</script>

<template>
  <div class="settings-menu">
    <div class="settings-list">
      <div class="settings-header">Miscellaneous</div>
      <Setting
        name="Persistent Tabs"
        label="Persistent Tabs"
        description="Save and reload the previous tab on page refresh"
      >
        <BooleanInput bind:value={$persistent_tabs} />
      </Setting>

      <Setting
        name="Default Tab"
        label="Default Tab"
        description="The tab to load on page startup (not available with persistent tabs)"
      >
        <Select
          disabled={$persistent_tabs}
          bind:value={$default_tab}
          options={[
            ["Home", 0],
            ["Transactions", 1],
            ["Settings", 2],
          ]}
        />
      </Setting>
    </div>
  </div>
</template>

<style lang="scss">
  .settings-menu {
    padding-right: 2rem;
    padding-left: 2rem;
  }
  .settings-header {
    font-weight: 600;
    color: var(--dark-color);
    opacity: 0.8;
  }
</style>
