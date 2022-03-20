<script lang="ts">
  import ArrowTopRight from "svelte-material-icons/ArrowTopRight.svelte";
  export let value: string;
  export let denom: string;
  export let approxMelValue: string = "";
</script>

<div class="wrap">
  <div class="root">
    <div class="icon" class:mel={denom === "MEL"} class:sym={denom === "SYM"} />
    <div class="label">
      <div><b>{value}</b> {denom}</div>
      {#if approxMelValue}<div class="approx">
          ≈ <b>{approxMelValue}</b> MEL
        </div>{/if}
    </div>
    <div class="send"><ArrowTopRight width="1.5rem" height="1.5rem" /></div>
  </div>
</div>

<style lang="scss">
  .wrap {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .root {
    background-color: #006e5410;
    height: 5rem;
    border-radius: 1rem;
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: var(--dark-color);
  }

  .approx {
    font-size: 0.8rem;
    opacity: 0.6;
  }

  .icon {
    width: 3rem;
    min-width: 3rem;
    height: 3rem;
    background-color: gray;
    border-radius: 100px;
    margin-right: 1rem;
  }

  .label {
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow-x: hidden;
    white-space: nowrap;
    // max-width: calc(70vw - 5rem);
  }

  .mel {
    background-image: url("/images/mel-coin.png");
    background-size: contain;
  }

  .sym {
    background-image: url("/images/sym-coin.png");
    background-size: contain;
  }

  .send {
    color: var(--dark-color);
  }
</style>
