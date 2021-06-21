# Ginkou
A wallet for your Themelio coins.

Ginkou is a web interface, developed in Svelte and Material UI.
It communicates with the [mel wallet daemon](https://github.com/themeliolabs/melwalletd) over http.
The daemon is packaged together with the wallet interface using Tauri.

## Develop
Install the dependencies and start the environment to rebuild on file changes.

```bash
npm install
npm run dev
```

## Run API tests
```bash
npm run test
```

## Rebuild nix env
For developers updating the nix configuration only:
```bash
node2nix --development -l package-lock.json
```
