import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import autoPreprocess from "svelte-preprocess";
import { pug } from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-node-polyfills";
import inlineSvg from "rollup-plugin-inline-svg";
import alias from "@rollup/plugin-alias";
import scss from "rollup-plugin-scss";
import buble from "rollup-plugin-buble";
import babel from "rollup-plugin-babel";

const path = require("path");

const rootDir = path.resolve(__dirname, "src");

console.log(rootDir);

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn(
        "npm",
        ["run", "start", "--", "--dev"],
        {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true,
        }
      );

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/utils/main.ts",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
    inlineDynamicImports: true,
  },
  plugins: [
    alias({
      resolve: [".ts", ".js", ".svelte", ".scss"],
      entries: {
        "@": path.resolve(rootDir),
      },
    }),
    pug(),
    inlineSvg(),
    nodePolyfills(),
    svelte({
      preprocess: autoPreprocess({
        sourceMap: true,
        // scss: {
        //   prependData: "@use 'src/res/styles/app.scss' as *;",
        // },
      }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        // enableSourcemap: true, // Set to  true if you want them
      },
    }),
    scss(),
    typescript({ sourceMap: !production }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    babel({
      extensions: [".js", ".mjs", ".html", ".svelte"],
      runtimeHelpers: true,
      exclude: ["node_modules/@babel/**"],
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
            useBuiltIns: "usage",
            corejs: 3,
          },
        ],
      ],
      plugins: [
        "@babel/plugin-syntax-dynamic-import",
        [
          "@babel/plugin-transform-runtime",
          {
            useESModules: true,
          },
        ],
      ],
    }),

    buble({ transforms: { generator: false, dangerousForOf: true } }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // // If we're building for production (npm run build
    // // instead of npm run dev), minify
    // production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
