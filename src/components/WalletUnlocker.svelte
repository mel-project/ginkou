<script lang="typescript">
  export let name: string;
  export let open: boolean;
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import Button, { Label } from "@smui/button";

  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import { unlock_wallet } from "@/utils";
  import { createEventDispatcher } from "svelte";
  let password = "";
</script>

<Dialog bind:open scrimClickAction="" escapeKeyAction="">
  <Title>Unlock wallet</Title>
  <Content>
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
  </Content>
  <Actions>
    <Button
      on:click={async () => {
        await unlock_wallet(name, password)
          .ifLeft((err) => alert(err))
          .run();
      }}
    >
      <Label>Unlock</Label>
    </Button>
  </Actions>
</Dialog>
