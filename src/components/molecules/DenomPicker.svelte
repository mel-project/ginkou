<script lang="ts">
  import { denom2str } from "../../utils/utils.old";

  import Modal from "../atoms/Modal.svelte";
  import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
  export let denom: string = "6d";

  export let blacklist: string[] = [];

  let pickerOpen = false;

  const denom2img = (denom: string) => {
    if (denom === "6d") {
      return "mel-coin.png";
    } else if (denom == "73") {
      return "sym-coin.png";
    } else {
      return "unknown-coin.png";
    }
  };

  $: descriptors = [
    {
      name: "MEL",
      desc: "Main circulating currency of Themelio",
      denom: "6d",
    },
    {
      name: "SYM",
      desc: "Proof-of-stake asset of Themelio",
      denom: "73",
    },
    {
      name: "ERG",
      desc: "Temporary asset for sequential proof-of-work",
      denom: "64",
    },
  ].filter((d) => !blacklist.includes(d.denom));
</script>

<div class="wrap">
  <Modal
    title="Select an asset"
    open={pickerOpen}
    onClose={() => (pickerOpen = false)}
  >
    {#each descriptors as desc}
      <div
        class="selectable"
        on:click={() => {
          denom = desc.denom;
          pickerOpen = false;
        }}
      >
        <img src={`/images/${denom2img(desc.denom)}`} alt="icon" />
        <div>
          <div class="selectable-name">{desc.name}</div>
          <div class="selectable-desc">{desc.desc}</div>
        </div>
      </div>
    {/each}
  </Modal>
  <div class="coin-switcher" on:click={() => (pickerOpen = true)}>
    <img src={`/images/${denom2img(denom)}`} class="icon" alt="icon" />
    <span> {denom2str(denom)} </span>
    <ChevronDown width="1.2rem" height="1.2rem" />
  </div>
</div>

<style>
  .icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
    border-radius: 200px;
  }

  .wrap {
  }

  .coin-switcher {
    background-color: var(--bubble-color);
    height: 2.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 200px;
    color: var(--dark-color);
    font-weight: 500;
    width: 100%;
    cursor: pointer;
    padding-left: 0.8rem;
    padding-right: 0.4rem;
  }

  .selectable {
    padding: 0.8rem;
    background-color: var(--bubble-color);
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
  }

  .selectable-name {
    font-size: 120%;
    line-height: 95%;
  }

  .selectable-desc {
    font-size: 80%;
    line-height: 100%;
  }

  .selectable img {
    height: 2.5rem;
    width: 2.5rem;
    margin-right: 1rem;
    border-radius: 200px;
  }
</style>
