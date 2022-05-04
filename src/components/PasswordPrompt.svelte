<script lang="ts">
  import TextField from "./UI/inputs/TextField.svelte";
  import { currentWalletName, currentWalletSummary } from "../stores";
  import { ensure_unlocked } from "../utils/utils";
  import { slide } from "svelte/transition";

  import RoundButton from "../components/RoundButton.svelte";
  let password = "";
  let unsuccessful: Error | undefined;

  export let try_unlock = async (password: string) => {
    if ($currentWalletName && $currentWalletSummary) {
      try {
        await ensure_unlocked(
          $currentWalletName,
          $currentWalletSummary,
          password
        );
      } catch (err) {
        unsuccessful = err as Error;
      }
    }
  };

  let handleInputClick = () => {
    if (unsuccessful) {
      password = "";
      unsuccessful = undefined;
    }
  };
</script>

<form class="content" action="javascript:void(0);">
  <div class="logo">
    <img src="images/mel-coin.png" alt="" srcset="" />
  </div>
  {#if unsuccessful}
    <div class="alert-container centered">
      <div class="alert alert-danger" transition:slide role="alert">
        {unsuccessful}
      </div>
    </div>
  {/if}
  <TextField
    bind:value={password}
    on:click={() => handleInputClick()}
    label="passphrase: "
    class="underlined"
    password
  />

  <div class="unlock-wrapper">
    <div class="unlock">
      <RoundButton on:click={(x) => try_unlock(password)} fill outline submit
        >Unlock</RoundButton
      >
    </div>
  </div>
</form>

<style lang="scss">
  @use "../res/styles/alerts.scss";
  .alert-container.centered {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .alert {
    width: 50%;
  }
  .logo {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 5em;
    margin-bottom: 3em;
  }
  .logo img {
    height: 7em;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 1em;
    height: 50%;
    justify-content: center;
  }
  .unlock-wrapper {
    display: flex;
    justify-content: space-around;
  }
  .unlock {
    width: 90%;
    height: 3rem;
  }
</style>
