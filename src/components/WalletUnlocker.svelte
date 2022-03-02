<script lang="typescript">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import Button, { Label } from "@smui/button";
  
  import { unlock_wallet } from "@/utils";
  import { createEventDispatcher } from "svelte";
  import Dialog from "./UI/windows/Dialog.svelte";
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
          <Textfield
            type="password"
            variant="outlined"
            bind:value={password}
            label="Password"
          >
            <HelperText er slot="helper">{password}</HelperText>
          </Textfield>
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
          <Label>Unlock</Label>
        </Button>
    </svelte:fragment>
  </Dialog>
</template>
