{ stdenv, pkgs, nodejs, rollup }:

let
  nodeDependencies = (pkgs.callPackage ./default.nix {
    nodejs = nodejs;
  }).shell.nodeDependencies;
in
stdenv.mkDerivation {
  name = "ginkou";
  src = ./.;
  buildInputs = [nodejs rollup];
  buildCommand = ''
    cp -r $src/* .
    ln -s ${nodeDependencies}/lib/node_modules ./node_modules

    chmod 777 -R public

    # Build and copy to drv out
    npm run build
    npm run smui-theme-light
    cp -r public/build/ $out/
  '';
}
