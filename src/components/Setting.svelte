<script lang="ts">
  export let label: string = "";
  export let description: string;
  export let name: string;
  let _class = "";
  export {_class as class}
</script>

<template>
  <div class="setting">
    <div class="info">
      <label for={name}>{label}</label>
      <div class="description {_class}" >{description}</div>
    </div>
    <slot />
  </div>
  <!-- {Object.keys(setting)} -->
</template>

<style lang="scss">
  .text-overflow-ellipsis{
    text-overflow: ellipsis;
    overflow: hidden;
  }
  select,
  input {
    width: 12em;
  }
  .info {
    display: flex;
    flex-direction: column;
    width: 65%;
    flex-grow: 1;
    padding-right: 0.5rem;
  }
  label {
    // color: theme.$primary;
    display: inline;
    padding-right: 1em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .setting {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 110%;
  }
  .description {
    opacity: 0.8;
    font-size: 90%;
  }
</style>
