<script lang="ts">
  export let label: string = "";
  export let outline: boolean = false;
  export let bold: boolean = false;
  export let small: boolean = false;
  export let disabled: boolean = false;
  export let onClick = () => {};
</script>

<button
  type="button"
  class="btn btn-round"
  class:btn-primary={!outline}
  class:btn-outline-primary={outline}
  class:heavy={bold}
  class:small
  {disabled}
  on:click={() => onClick()}
>
  <slot />
  <div>{label}</div></button
>

<style lang="scss">
  .btn-round {
    border-radius: 10rem;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 2.4rem;
  }

  .small {
    height: 2rem;
  }

  .heavy {
    font-weight: 500;
  }

  .btn-outline-primary {
    border-width: 0.15rem;
  }
</style>
