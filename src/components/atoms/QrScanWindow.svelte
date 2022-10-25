<script lang="ts">
  import { onMount } from "svelte";
  import QrScanner from "qr-scanner";
  let qrCanvas: HTMLVideoElement;

  export let onScan = (_s: QrScanner.ScanResult) => {};

  onMount(async () => {
    console.log("qrs", qrCanvas);
    const qrScanner = new QrScanner(qrCanvas, onScan, {});
    qrScanner.start();
  });
</script>

<!-- svelte-ignore a11y-media-has-caption -->
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
