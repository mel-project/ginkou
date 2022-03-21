<script lang="ts">
  import { currentWalletSummary } from "../stores";

  let recipient: string = "";
  let amount: string = "";
  $: currencies = $currentWalletSummary
    ? Object.keys($currentWalletSummary.detailed_balance)
    : [];
</script>

<div>
  <div class="section">
    <div class="header">Recipient 1</div>
    <div class="input-group">
      <span class="input-group-text">Recipient</span>
      <input
        type="text"
        placeholder="Enter an address"
        class="form-control"
        bind:value={recipient}
      />
    </div>

    <div class="input-group">
      <span class="input-group-text">Amount</span>
      <input
        type="number"
        placeholder="Enter an amount"
        class="form-control"
        bind:value={amount}
      />
      <select class="form-select">
        <option selected>MEL</option>
        <option value="1">One</option>
      </select>
    </div>
  </div>
</div>

<style lang="scss">
  .header {
    font-weight: 600;
    opacity: 0.8;
  }
  .input-group-text {
    width: 6rem;
  }

  .input-group {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: 4rem;
  }

  .input-group * {
    border-radius: 200px;
  }

  .form-select {
    flex: 0 0 auto !important;
    width: auto;
  }
  .form-control {
    flex-grow: 1;
  }
</style>
