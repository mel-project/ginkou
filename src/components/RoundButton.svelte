<script lang="ts">
  export let label: string = "";
  export let outline: boolean = false;
</script>

<button
  type="button"
  class="btn btn-round"
  class:btn-primary={!outline}
  class:btn-outline-primary={outline}>{label}</button
>

<style lang="scss">
  .btn-round {
    border-radius: 10rem;
  }
</style>
