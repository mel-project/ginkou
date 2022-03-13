<script lang="ts">
  import ViewDashboardOutline from "svelte-material-icons/ViewDashboardOutline.svelte";
  import HistoryIcon from "svelte-material-icons/History.svelte";
  import CogOutline from "svelte-material-icons/CogOutline.svelte";

  export let selected: number = 0;

  export let onSelect = (selection: number) => {};
</script>

<div class="tabs">
  <div class="tab" class:selected={selected === 0} on:click={() => onSelect(0)}>
    <div class="tab-icon">
      <ViewDashboardOutline width="2rem" height="2rem" />
    </div>
    <div class="tab-label">Overview</div>
  </div>
  <div class="tab" class:selected={selected === 1} on:click={() => onSelect(1)}>
    <div class="tab-icon"><HistoryIcon width="2rem" height="2rem" /></div>
    <div class="tab-label">Transactions</div>
  </div>
  <div class="tab" class:selected={selected === 2} on:click={() => onSelect(2)}>
    <div class="tab-icon"><CogOutline width="2rem" height="2rem" /></div>
    <div class="tab-label">Settings</div>
  </div>
</div>

<style lang="scss">
  .tabs {
    width: 100%;
    height: 4rem;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid $primary;

    display: flex;
    flex-direction: row;
    justify-content: space-around;

    color: $dark;
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
    color: $primary;
    opacity: 1;
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
