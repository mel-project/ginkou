<script lang="ts">
  import { onMount } from "svelte";
  import QrScanner from "qr-scanner";
  let qrCanvas: HTMLVideoElement;

  export let onScan = (s: string) => {};

  onMount(async () => {
    console.log("qrs", qrCanvas);
    const qrScanner = new QrScanner(qrCanvas, (result) => {
      console.log("decoded qr code:", result);
      onScan(result);
    });
    qrScanner.start();
  });
</script>

<video class="qr-canvas" bind:this={qrCanvas} />

<style>
  .qr-canvas {
    width: 70vmin;
    height: 70vmin;
    margin-top: 2rem;
    margin-bottom: 2rem;
    object-fit: cover;
    border-radius: 1rem;
    border: var(--primary-color) 0.2rem solid;
  }
</style>
