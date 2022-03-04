<script lang="ts">
  
  import { createEventDispatcher } from "svelte";
  import Dialog from "./UI/windows/Dialog.svelte";
  import Button from "./UI/inputs/Button.svelte";
  import TextField from "./UI/inputs/TextField.svelte";
import { unlock_wallet } from "../utils/utils";

  export let name: string;
  let password = "";
  const dispatch = createEventDispatcher();
  const close = (evt: any) => {
    dispatch("close", evt.details)
  };
</script>

<template>
  <Dialog on:close={close} open={Boolean(name)} title="Unlock Wallet" >
    <svelte:fragment>
      <div>
        <div style="margin-top: 10px">
          <TextField
            type="password"
            variant="outlined"
            bind:value={password}
            label="Password"
          >
          </TextField>
        </div>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="actions" let:close>
        <Button
          on:click={async () => {
            await unlock_wallet(name, password)
              .ifLeft((err) => alert(err))
              .run();
            close()
          }}
        >
          Unlock
        </Button>
    </svelte:fragment>
  </Dialog>
</template>
