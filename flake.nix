{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      nodejs = pkgs.nodejs_20;
      overlays = [
        (final: prev: {
          nodePackages = prev.nodePackages.override {
            nodejs = nodejs;
          };
        })
      ];
      pkgs = import nixpkgs {inherit system overlays;};
    in {
      formatter = pkgs.alejandra;
      devShells.default = pkgs.mkShell {
        packages = [
          nodejs
          pkgs.nodePackages.pnpm
        ];
      };
    });
}
