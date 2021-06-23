{
  description = "Ginkou wallet javascript frontend";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-21.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = {
    self,
    nixpkgs,
    flake-utils
  }:
  flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
      ginkou = pkgs.callPackage ./rollup-build.nix {
        nodejs = pkgs.nodejs-12_x;
        rollup = pkgs.nodePackages.rollup;
      };
    in
      {
        packages.ginkou = ginkou;
        defaultPackage = ginkou;
      });
}
