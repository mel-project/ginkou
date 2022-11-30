<script lang="ts">
  import { Textfield, Button } from "components";
  import { currentWalletName, currentWalletSummary } from "../stores";
  import { ensure_unlocked } from "../utils/wallet-utils";

  import { createEventDispatcher } from "svelte";
  let password = "";
  let unsuccessful: Error | undefined;
  let dispatch = createEventDispatcher();

  export let close_button = false;
  export let confirm_label = "Unlock";
  export let pending = false;
  export let try_unlock = async (password: string) => {
    if ($currentWalletName && $currentWalletSummary) {
      try {
        pending = true;
        await ensure_unlocked(
          $currentWalletName,
          password
        );
        dispatch("unlock_success", {
          walletName: $currentWalletName,
          password,
        });
      } catch (err) {
        dispatch("unlock_failure");
        unsuccessful = err as Error;
      } finally {
        pending = false;
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
      <div class="alert alert-danger" role="alert">
        {unsuccessful}
      </div>
    </div>
  {/if}
  <Textfield
    bind:value={password}
    on:click={() => handleInputClick()}
    label="passphrase: "
    class="underlined"
    password
    autofocus
    disabled={pending}
  />

  <div class="unlock-wrapper">
    <div class="unlock">
      {#if close_button}
        <div class="close_button">
          <Button on:click={(_x) => dispatch("close")} fill>Close</Button>
        </div>
      {/if}
      <Button
        on:click={(_x) => try_unlock(password)}
        fill
        outline
        submit
        disabled={pending}>{confirm_label}</Button
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
    display: flex;
    flex-direction: row;
    gap: 1em;
  }
</style>
