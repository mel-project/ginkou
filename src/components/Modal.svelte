<script lang="ts">
  export let open: boolean;

  export let onClose: () => any;

  export let title: string;

  export let pullup: boolean = false;
</script>

<div class="blocker" class:open class:closed={!open}>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div
        class="modal-content"
        class:pullup
        class:pullup-open={open}
        class:pullup-closed={!open}
      >
        <div class="modal-header">
          <h5 class="modal-title">{title}</h5>
          <button type="button" class="btn-close" on:click={() => onClose()} />
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .modal-content {
    background-color: var(--background-color) !important;
  }

  .pullup {
    border-radius: 2rem 2rem 0 0 !important;
    position: fixed;
    left: 0;
  }

  .pullup.pullup-open {
    bottom: 0;
    transition: all 0.2s linear;
  }

  .pullup.pullup-closed {
    bottom: -70vh;
    transition: all 0.2s linear;
  }

  .open {
    visibility: visible !important;
    opacity: 1 !important;
    transition: opacity 0.2s linear;
  }

  .closed {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.2s, opacity 0.2s linear;
  }

  .blocker {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #00000033;
    width: 100vh;
    height: 100vh;
    z-index: 100;
  }
  .modal {
    display: block;
    z-index: 1000;
  }

  .modal-body {
    max-height: 70vh;
    overflow-y: scroll;
  }
</style>
