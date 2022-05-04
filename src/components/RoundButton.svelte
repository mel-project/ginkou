<script lang="ts">
import { onMount } from "svelte";


  export let label: string = "";
  export let outline: boolean = false;
  export let secondary: boolean = false;
  export let bold: boolean = false;
  export let small: boolean = false;
  export let fill: boolean = false;
  export let disabled: boolean = false;
  export let onClick: (()=>void) | undefined = undefined;

  onMount(()=>{
    if(onClick){
      console.warn("`RoundButton.svelte` attribute `onClick` will be depreciated")
    }
  })

</script>

<button
  type="button"
  class="btn btn-round"
  class:btn-primary={!outline}
  class:btn-outline-primary={outline}
  class:secondary
  class:heavy={bold}
  class:small
  class:fill
  {disabled}
  on:click={() => onClick && onClick()}
  on:click
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
  .fill{
    width: 100%;
    height: 100%;
    justify-content: center;
  }
  .secondary {
    background-color: var(--secondary-color);
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
