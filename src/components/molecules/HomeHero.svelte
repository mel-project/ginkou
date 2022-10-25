<script lang="ts">
  import Button from "../atoms/Button.svelte";
  import ArrowTopRight from "svelte-material-icons/ArrowTopRight.svelte";
  import ArrowBottomLeft from "svelte-material-icons/ArrowBottomLeft.svelte";

  export let melBalance: string | null = null;
  // svelte-ignore unused-export-let
  export let otherBalance: string | null = null;

  export let onSend = () => {};
  export let onReceive = () => {};
  // export let onSwap = () => {};
</script>

<div class="hero">
  <div class="big-balance placeholder-wave">
    <div class="big-balance-number" class:placeholder={melBalance === null}>
      {melBalance || "0.00000000"}
    </div>
    MEL
  </div>
  <!-- <div class="small-balance">
    ≈ <b class="small-balance-number" class:placeholder={otherBalance === null}
      >{otherBalance || "0.00"}</b
    >
    MEL
    <span class="fw-light">other assets</span>
  </div> -->
  <div class="hero-buttons">
    <div>
      <Button label="Send" bold onClick={onSend}
        ><ArrowTopRight width="1.5rem" height="1.5rem" />&nbsp;</Button
      >
    </div>
    <div>
      <Button label="Receive" outline bold onClick={onReceive}
        ><ArrowBottomLeft width="1.5rem" height="1.5rem" />&nbsp;</Button
      >
    </div>
  </div>
</div>

<style lang="scss">
  .hero {
    width: 100%;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
  .big-balance {
    font-size: calc(min(3rem, 9.5vw));
    font-family: "Rubik";
    color: var(--dark-color);
    font-weight: 300;
    letter-spacing: -0.04em;
  }
  .big-balance-number {
    max-width: 70vw;
    overflow-x: hidden;
    text-overflow: ellipsis;
    display: inline;
    font-weight: 400;
  }

  // .small-balance {
  //   color: var(--dark-color);
  //   font-family: "Rubik";
  //   opacity: 0.8;
  // }

  .hero-buttons {
    padding-top: 1rem;
  }

  .hero-buttons div {
    padding-right: 0.6rem;
    display: inline-block;
  }
</style>
