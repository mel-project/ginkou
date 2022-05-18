import "core-js"; // <- at the top of your entry point

import App from "../App.svelte";

import "../res/styles/app.scss";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
