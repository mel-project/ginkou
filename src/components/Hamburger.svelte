<script>
  let _class = ""
  export {_class as class}
  export let menuOpen = false
  
</script>

<div class={`hamburger back ${_class}`}>
  <label>
    <input type="checkbox" style="display: none" bind:checked={menuOpen}/>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" />
      <path class="line--1" d="M0 55l14-10c4.7-3.3 9-5 13-5h72" />
      <path class="line--2" d="M0 50h99" />
      <path class="line--3" d="M0 45l14 10c4.7 3.3 9 5 13 5h72" />
    </svg>
  </label>
</div>

<style type="text/scss">
  @use "../styles/theme.scss" as theme;
  @import "./styles/normalize.css";

  label {
    display: block;
    cursor: pointer;
    position: relative;
    width: 4em;
    direction: ltr;
    &:hover>svg>path{
      stroke: white;
    }
  }
  path {
    fill: none;
    stroke: #666;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: var(--length) var(--total-length);
    stroke-dashoffset: var(--offset);
    transition: all 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);

  }
  .hamburger {
    --length: 24;
    --offset: -38;
    direction: ltr;
  }
  circle {
    fill: theme.$primary;
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(1, 0, 0, 1);
  }
  label:hover circle {
    opacity: 1;
  }
  .cross input:checked + svg .line--1,
  .cross input:checked + svg .line--3 {
    --length: 22.627416998;
  }
  .cross input:checked + svg .line--2 {
    --length: 0;
  }
  .back input:checked + svg .line--1,
  .back input:checked + svg .line--3 {
    --length: 8.602325267;
  }
  .hamburger .line--1,
  .hamburger .line--3 {
    --total-length: 103.3506164551;
  }
  .hamburger .line--1,
  .hamburger .line--3 {
    --offset: -42.3506164551;
  }

  .hamburger .line--2 {
    --total-length: 99;
  }
  .hamburger input:checked + svg path {
    transform: translateX(31px);
  }
  .hamburger input:checked + svg .line--1,
  .hamburger input:checked + svg .line--3 {
    --offset: -8.602325267;
  }
  .hamburger input:checked + svg .line--2 {
    --length: 24;
    --offset: -7;
  }
  .debug {
    display: none;
  }
  .line--debug {
    display: none;
    opacity: 0.2;
    stroke-dasharray: none;
  }
</style>
