<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { InputVariant } from "../../../utils/svelte-types";

  export let value: boolean;
  let focused = false;
  let _class: string = "";
  let labeled: boolean = true;
  export { _class as class };

  const event_dispatcher = createEventDispatcher();

  const handleKeyPress = (evt: KeyboardEvent) => {
    if (evt.key == "Enter") event_dispatcher("key_enter");
    else if (evt.key == "Tab") event_dispatcher("key_tab");
  };
  const handleFocus = (evt: FocusEvent) => {
    focused = true;
    event_dispatcher("focus", evt);
  };
  const handleBlur = (evt: FocusEvent) => {
    focused = false;
    event_dispatcher("blur", evt);
  };
</script>

<template>
  <div class="_container">
    <div class="input {_class}" on:click|stopPropagation>
      <input type="checkbox"
        name="input"
        bind:checked={value}
        on:click|stopPropagation
        on:change
        on:input
        on:blur={handleBlur}
        on:focus={handleFocus}
        on:keypress={handleKeyPress}
        {...$$props}
        disabled={false}
      />
    </div>
  </div>
</template>

<style lang="scss">
  @use "../../../res/styles/theme.scss" as theme;
</style>
