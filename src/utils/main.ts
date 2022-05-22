import "core-js/stable";
import "regenerator-runtime/runtime";
import "core-js/es/set";
import "core-js/es/weak-map";
import "../res/styles/app.scss";
import "toastify-js/src/toastify.css";
import App from "../App.svelte";


const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
