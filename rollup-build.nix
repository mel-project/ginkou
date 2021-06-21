{ stdenv, pkgs, nodejs }:

let
  nodeDependencies = (pkgs.callPackage ./default.nix {
    nodejs = nodejs;
  }).shell.nodeDependencies;
in
stdenv.mkDerivation {
  name = "ginkou";
  src = ./.;
  buildInputs = [nodejs];
  buildPhase = ''
    ln -s ${nodeDependencies}/lib/node_modules ./node_modules
    export PATH="${nodeDependencies}/bin:$PATH"

    # Build and copy to drv out
    npm run build
    cp -r public/build/ $out/
  '';
}
