<script>
  import { createEventDispatcher } from "svelte";

  export let value = "";
  export let label = "";

  let focused = false;
  let _class;
  export { _class as class };

  const event_dispatcher = createEventDispatcher();

  const handleKeyPress = (evt) => {
    if (evt.key == "Enter") event_dispatcher("key_enter");
    else if (evt.key == "Tab") event_dispatcher("key_tab");
  };
  const handleFocus = (evt) => {
    focused = true;
    event_dispatcher("focus", evt);
  };
  const handleBlur = (evt) => {
    focused = false;
    event_dispatcher("blur", evt);
  };
</script>

<template lang="pug">
    .container
      div(class!="input {_class}"  on:click)
        label(for="input") {label}
        input(type="text" name="input" bind:value 
          on:change on:input 
          on:blur!="{handleBlur}" 
          on:focus!="{handleFocus}"
          on:keypress!="{handleKeyPress}")
      slot({focused})
</template>

<style lang="scss">
  @use "../../theme/_smui-theme.scss" as theme;
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
  .input {
    border-bottom: 1px solid black;
    display: flex;
    align-items: center;
    margin: 0;
    margin-left: 0;
  }
  .container {
    position: relative;
  }

</style>
