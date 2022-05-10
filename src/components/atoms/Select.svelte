<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type Source = $$Generic<number | string>;

  export let value: Source;
  export let options: [string, Source][];
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
  <div class="input {_class}" on:click|stopPropagation>
    <select
      name="input"
      bind:value
      class="form-select"
      on:click|stopPropagation
      on:change
      on:input
      on:blur={handleBlur}
      on:focus={handleFocus}
      on:keypress={handleKeyPress}
      {...$$props}
    >
      {#each options as option}
        <option value={option[1]}>
          {option[0]}
        </option>
      {/each}
    </select>
  </div>
</template>

<style lang="scss">
</style>
