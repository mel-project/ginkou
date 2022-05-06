import App from "../App.svelte";
import "../res/styles/app.scss";
import "toastify-js/src/toastify.css";
import "@babel/polyfill";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
