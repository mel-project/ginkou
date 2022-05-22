<script lang="ts">
  import { createEventDispatcher } from "svelte";
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
  <div class="form-check form-switch input {_class}" on:click|stopPropagation>
    <input
      type="checkbox"
      name="input"
      class="form-check-input"
      role="switch"
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
</template>

<style lang="scss">
  input {
    height: 1.5rem;
    display: block;
    width: 2.5rem !important;
  }
</style>
