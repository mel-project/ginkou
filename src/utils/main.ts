import "core-js/stable";
import "regenerator-runtime/runtime";
import "core-js/es/set";
import "core-js/es/weak-map";

import App from "../App.svelte";

import "../res/styles/app.scss";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
