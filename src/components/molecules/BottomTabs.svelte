<script lang="ts">
  import ViewDashboardOutline from "svelte-material-icons/ViewDashboardOutline.svelte";
  import HistoryIcon from "svelte-material-icons/History.svelte";
  import SwapVertical from "svelte-material-icons/SwapVertical.svelte";
  import CogOutline from "svelte-material-icons/CogOutline.svelte";

  export let selected: number = 0;

  export let onSelect = (selection: number) => {
    selected = selection;
  };
</script>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="tabs">
  <div class="tab" class:selected={selected === 0} on:click={() => onSelect(0)}>
    <div class="tab-icon">
      <ViewDashboardOutline width="2rem" height="2rem" box-shadow="100px"/>
    </div>
    <div class="tab-label">Overview</div>
  </div>
  <div class="tab" class:selected={selected === 1} on:click={() => onSelect(1)}>
    <div class="tab-icon"><SwapVertical width="2rem" height="2rem" /></div>
    <div class="tab-label">Swap</div>
  </div>
  <div class="tab" class:selected={selected === 2} on:click={() => onSelect(2)}>
    <div class="tab-icon"><HistoryIcon width="2rem" height="2rem" /></div>
    <div class="tab-label">Transactions</div>
  </div>
  <div class="tab" class:selected={selected === 3} on:click={() => onSelect(3)}>
    <div class="tab-icon"><CogOutline width="2rem" height="2rem" /></div>
    <div class="tab-label">Settings</div>
  </div>
</div>

<style lang="scss">
  .tabs {
    width: 100%;
    height: 4rem;
    position: fixed;
    z-index: -1;
    bottom: 0;
    left: 0;
    border-top: 1px solid var(--primary-color);

    display: flex;
    flex-direction: row;
    justify-content: space-around;

    color: var(--dark-color);
  }

  .tab {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    opacity: 0.6;
  }

  .selected {
    color: var(--primary-color);
    opacity: 1;

  }
  ::global(svg) {
    // filter: drop-shadow(0px 0px 10px --primary-color)
    // background: black;
  }
  .selected .tab-label {
    font-weight: 600;
  }

  .tab-icon {
    width: 2rem;
    height: 2rem;
  }

  .tab-label {
    font-size: 0.9rem;
    font-weight: 500;
  }
</style>
