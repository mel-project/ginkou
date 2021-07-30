<script lang="typescript">
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import List, { Item, Text } from "@smui/list";
  import { current_wallet, wallet_summaries } from "@/store";
  import { new_wallet } from "@/utils";
  import WalletMenuItem from "@/components/WalletMenuItem.svelte";
  import Button, { Label, Icon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";

  let add_new_open = false;
  let new_name = "";
  let new_password = "";
  let new_testnet = false;

  const raise_err = (err: any) => {
    alert(err); // replace with something decent
  };

  const create_wallet_callback = async () => {
    // validate name
    if (!new_name) {
      raise_err("wallet name cannot be empty");
    } else {
      // we try now
      await new_wallet(new_name, new_testnet, new_password)
        .ifLeft(raise_err)
        .ifRight((_) => {
          add_new_open = false;
          new_name = "";
          new_password = "";
        })
        .run();
    }
  };
</script>

<div id="wallet-menu-inner">
  {#each Object.entries($wallet_summaries) as [wlt, wlt_content]}
    <!-- <Item on:SMUI:action={() => (active_wallet = wlt)}>
        <Text>{wlt}</Text>
      </Item> -->
    <div class="menu-item" on:click={() => ($current_wallet = wlt)}>
      <WalletMenuItem
        name={wlt}
        wallet={wlt_content}
        selected={wlt === $current_wallet}
      />
    </div>
  {/each}
  <div class="menu-item">
    <div class="wallet-add-new">
      <Button on:click={() => (add_new_open = true)}>
        <Icon class="material-icons">add</Icon>
        <Label>Create wallet</Label>
      </Button>
    </div>
  </div>
</div>

<Dialog bind:open={add_new_open}>
  <Title>Create a new wallet</Title>
  <Content>
    <div style="margin-top: 10px">
      <Textfield variant="outlined" bind:value={new_name} label="Wallet name">
        <HelperText slot="helper">{new_password}</HelperText>
      </Textfield>
      <Textfield
        type="password"
        variant="outlined"
        bind:value={new_password}
        label="Password"
      >
        <HelperText slot="helper">{new_password}</HelperText>
      </Textfield>
    </div>
    <div style="text-align: right">
      <Button variant="outlined" on:click={create_wallet_callback}>
        <Label>OK</Label>
      </Button>
    </div>
  </Content>
</Dialog>

<style type="text/scss">
  @use '../theme/_smui-theme.scss' as theme;
  #wallet-menu-inner{
    overflow: hidden;
    overflow-y: scroll;
    height: calc(100vh - 5em);
    direction: rtl;
    scrollbar-color: theme.$primary white;
  }
  .menu-item {
    direction: ltr;
  }

  .wallet-add-new {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    position: relative;
  }
</style>
