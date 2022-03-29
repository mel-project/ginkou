<script lang="ts">
  import { slide } from "svelte/transition";
  import { text } from "svelte/internal";
  import RoundButton from "./RoundButton.svelte";
  import PlusCircleOutline from "svelte-material-icons/PlusCircleOutline.svelte";
  import DownloadCircleOutline from "svelte-material-icons/DownloadCircleOutline.svelte";
  import { new_wallet } from "../utils/utils";
  import { currentWalletName } from "../stores";

  let state = "start";
  export let onCreate = () => {};

  let newName = "";
  let newPassword = "";
  let pending = false;
  let testnet = false;

  $: doCreate = async () => {
    pending = true;
    try {
      let lala = await new_wallet(newName, testnet, newPassword).run();
      lala
        .ifLeft((err) => alert(err))
        .ifRight((_) => {
          $currentWalletName = newName;
          onCreate();
        });
    } finally {
      pending = false;
    }
  };
</script>

<div>
  {#if state == "start"}
    <div class="page1" transition:slide>
      <div class="card" on:click={() => (state = "create")}>
        <div class="card-body">
          <h5 class="card-title">
            <PlusCircleOutline width="3rem" height="3rem" />
          </h5>
          <h5 class="card-title">Create a new wallet</h5>
          <p class="card-text">
            This will create a new wallet with a new master secret
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h5 class="card-title">
            <DownloadCircleOutline width="3rem" height="3rem" />
          </h5>
          <h5 class="card-title">Import an existing wallet</h5>
          <p class="card-text">
            This will import another wallet using its master secret
          </p>
        </div>
      </div>
    </div>
  {/if}

  {#if state == "create"}
    <div class="createpage" transition:slide>
      <div class="input-group">
        <span class="input-group-text">Name</span>
        <input
          type="text"
          placeholder="Enter an arbitrary name"
          class="form-control"
          bind:value={newName}
        />
      </div>
      <div class="input-group">
        <span class="input-group-text">Passphrase</span>
        <input
          type="password"
          placeholder="Enter a strong passphrase"
          class="form-control"
          bind:value={newPassword}
        />
      </div>

      <div class="final">
        <RoundButton
          label="Create wallet"
          onClick={doCreate}
          disabled={pending}
        />
        &nbsp;&nbsp;
        <RoundButton
          label="Cancel"
          onClick={() => (state = "start")}
          outline
          disabled={pending}
        />
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .final {
    padding-top: 1rem;
    display: flex;
    flex-direction: row-reverse;
    align-items: flex-end;
  }

  .card-body {
    color: var(--dark-color);
  }
  .page1 {
    text-align: center;
  }

  .card {
    background-color: var(--background-color);
    margin: 1.5rem;
  }

  .card:hover {
    background-color: var(--bubble-color);
    cursor: pointer;
  }

  .input-group {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: 4rem;
  }

  .input-group * {
    border-radius: 200px;
  }
</style>
