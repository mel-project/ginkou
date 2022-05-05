<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { InputVariant } from "../../../utils/svelte-types";
  export let value = "";
  export let label = "";
  export let disabled = false;
  let focused = false;
  export let password = false;
  export let autofocus = false;
  let _class: string = "";
  let variant: InputVariant = InputVariant.DEFAULT;
  let labeled: boolean = true;
  export { _class as class };

  const event_dispatcher = createEventDispatcher();

  const handleKeyPress = (evt: KeyboardEvent) => {
    if (evt.key == "Enter") event_dispatcher("key_enter");
    else if (evt.key == "Tab") event_dispatcher("key_tab");
  };
  const handleFocus = (evt: Event) => {
    focused = true;
    event_dispatcher("focus", evt);
  };
  const handleBlur = (evt: Event) => {
    focused = false;
    event_dispatcher("blur", evt);
  };
</script>

<template>
  <div class="container {variant}">
    <div class="input {_class}" on:click|stopPropagation>
      <label for="input">{labeled ? label : ""}</label>
      {#if password}
        <input
          type="password"
          name="input"
          bind:value
          on:click|stopPropagation
          on:change
          on:input
          on:blur={handleBlur}
          on:focus={handleFocus}
          on:keypress={handleKeyPress}
          placeholder={!labeled ? label : ""}
          {...$$props}
          disabled={false}
          {autofocus}
        />
      {:else}
        <input
          type="text"
          name="input"
          bind:value
          on:click|stopPropagation
          on:change
          on:input
          on:blur={handleBlur}
          on:focus={handleFocus}
          on:keypress={handleKeyPress}
          placeholder={!labeled ? label : ""}
          {...$$props}
          disabled={false}
          {autofocus}
        />
      {/if}
    </div>
    <slot {focused} {disabled} {value} />
  </div>
</template>

<style lang="scss">
  @use '../../../res/styles/theme.scss' as theme;

  input {
    border: none;
    background: transparent;
    width: 100%;
    max-width: 40em;
    padding: 0.5em 0;
    margin: 0;
    margin-left: 1em;
  }
  input:focus {
    outline: none;
  }
  .input.underlined {
    border-bottom: 1px solid theme.$primary;
    &:focus {
      outline: none;
    }
  }
  .input {
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    margin: 0;
    margin-left: 0;

    .outlined {
      border: 1px solid theme.$primary;
    }
  }

  .container {
    position: relative;
  }
</style>
