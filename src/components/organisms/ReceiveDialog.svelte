<script lang="ts">
  import { slide } from "svelte/transition";
  import { currentWalletSummary } from "../../stores";
  import QRCode from "qrcode";
  import { copyToClipboard, showToast } from "../../utils/utils";
  let qrCodeUrl =
    "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // empty image

  $: {
    (async () => {
      if ($currentWalletSummary) {
        try {
          qrCodeUrl = await QRCode.toDataURL($currentWalletSummary.address, {
            color: {
              dark: "#000",
            },
            errorCorrectionLevel: "H",
            margin: 0,
            // width: 1000,
          });
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }

  $: onCopy = () => {
    if ($currentWalletSummary) {
      copyToClipboard($currentWalletSummary.address);
      showToast("Address copied");
    }
  };
</script>

<div class="root">
  <img class="qrcode" src={qrCodeUrl} alt="qr code" />
  <div class="qrblurb">Scan for wallet address</div>
  <div class="address" on:click={onCopy}>
    <div class="address-ellipsis">{$currentWalletSummary?.address}</div>
    <div class="copy-pill">Copy</div>
  </div>
</div>

<style lang="scss">
  .root {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 2rem;
  }

  .qrcode {
    width: 40vmin;
    height: 40vmin;
    margin: 1rem;
    mix-blend-mode: darken;
    filter: brightness(500%);
    opacity: 0.8;
  }

  .address {
    cursor: pointer;
    max-width: 60vw;
    background-color: var(--bubble-color);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.2rem;
    padding-left: 1rem;
    padding-right: 1rem;
    border-radius: 2rem;
  }

  .address:hover {
    filter: opacity(80%);
  }

  .address-ellipsis {
    overflow-x: hidden;
    text-overflow: ellipsis;
  }

  .copy-pill {
    background-color: #00000022;
    border-radius: 2rem;
    margin: 0.1rem;
    font-size: 90%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
</style>
