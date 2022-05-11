<script lang="ts">
  import Setting from "../components/atoms/Setting.svelte";
  import {Select, Button, BooleanInput} from "components";
  import { persistent_tabs, default_tab } from "stores";
  import PasswordPrompt from "./PasswordPrompt.svelte";
  import { export_sk, showToast, copyToClipboard } from "utils/utils";
  import Modal from "../components/atoms/Modal.svelte";

  // import Settings from "../stores";

  let show_sk = false;
  let sk = "";

  let handleUnlock = async (ev: CustomEvent) => {
    let { walletName, password } = ev.detail;
    let either = await export_sk(walletName, password);
    sk = either.extract() as string;
    show_sk = false;
  };
</script>

<template>
  {#if show_sk}
    <div class="password_window">
      <PasswordPrompt
        confirm_label="Show Secret"
        close_button
        on:close={() => (show_sk = false)}
        on:unlock_success={handleUnlock}
      />
    </div>
  {:else}
    <div class="settings-menu">
      <Modal title="Secret key" open={sk !== ""} onClose={() => (sk = "")}>
        <div class="sk-wrap">
          <div class="sk-warning ">
            <b class="text-danger">Warning:</b> Your secret key controls access
            to all your funds. <i>Do not share it with anybody else!</i>
          </div>
          <textarea class="sk-area">{sk}</textarea>
          <Button
            label="Copy to clipboard"
            onClick={() => {
              copyToClipboard(sk);
              showToast("key copied to clipboard!");
            }}
          />
        </div>
        
      </Modal>
      <div class="settings-list">
        <div class="settings-header">Backup</div>
        <Setting
          name="Show Secret"
          label="Secret key"
          description="Export wallet secret key"
          class="text-overflow-ellipsis"
        >
          <Button
            onClick={() => (show_sk = true)}
            label="Export"
            outline
          />
        </Setting>
        <Setting name="Download Logs" label="Download Logs" description="">
          <Button
            outline
            disabled={$persistent_tabs}
            label="Download"
            on:click={()=>_ipc_handler('download-logs')}
          />
        </Setting>
      </div>
      <div class="settings-list">
        <div class="settings-header">Miscellaneous</div>
        <Setting
          name="Persistent Tabs"
          label="Persistent Tabs"
          description="Open the last-opened tab on startup"
        >
          <BooleanInput bind:value={$persistent_tabs} />
        </Setting>

        <Setting name="Default Tab" label="Default Tab" description="">
          <Select
            disabled={$persistent_tabs}
            bind:value={$default_tab}
            options={[
              ["Home", 0],
              ["Swap", 1],
              ["Transactions", 2],
              ["Settings", 3],
            ]}
          />
        </Setting>


      </div>
    </div>
  {/if}
</template>

<style lang="scss">
  .password_window {
    z-index: 100;
    position: absolute;
    height: 70vh;
    width: 100vw;
    left: 0;

    background: var(--background-color);
  }
  .settings-menu {
    padding-right: 2rem;
    padding-left: 2rem;
  }
  .settings-header {
    font-weight: 600;
    color: var(--dark-color);
    opacity: 0.8;
  }

  .settings-list {
    padding-top: 1rem;
  }

  .sk-area {
    width: 100%;
    font-family: monospace;
  }

  .sk-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 50vw;
    justify-content: space-around;
  }
</style>
