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

        # In the nix environment, playwright won't see the libs but it'll work
        # anyways. This skips the check. Honestly this might be shady and bite
        # me in the ass later.
        PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
      };
    });
}
