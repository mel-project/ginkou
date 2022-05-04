<script lang="ts">
  import Setting from "../components/Setting.svelte";
  import Select from "../components/UI/inputs/Select.svelte";
  import Button from "../components/UI/inputs/Button.svelte";
  import BooleanInput from "../components/UI/inputs/Boolean.svelte";

  import { persistent_tabs, default_tab } from "../stores";
import PasswordPrompt from "../components/PasswordPrompt.svelte";
  
  // import Settings from "../stores";
  let show_sk = false;
  let sk = "";
</script>

<template>
  <div class="settings-menu">
    {#if show_sk}
      <PasswordPrompt on:close></PasswordPrompt>
    {/if}
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
        description=""
      >
        <Select
          disabled={$persistent_tabs}
          bind:value={$default_tab}
          options={[
            ["Home", 0],
            ["Transactions", 1],
            ["Settings", 3],
          ]}
        />
      </Setting>
      <Setting
      name="Show Secret"
      label="Show your wallets secret key"
      description="Key: {sk || '<hidden>'}"
    >
      <button on:click={()=>show_sk = true}>Show</button>
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
