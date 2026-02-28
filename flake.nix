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
      overlays = [
        (final: prev: {
          nodePackages = prev.nodePackages.override {
            nodejs = prev.nodejs_24;
          };
        })
      ];
      pkgs = import nixpkgs {inherit system overlays;};
    in rec {
      formatter = pkgs.writeShellApplication {
        name = "alejandra-format-repo";
        runtimeInputs = [pkgs.alejandra];
        text = "alejandra .";
      };
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.nodejs
          pkgs.corepack # provides pnpm
        ];

        # In the nix environment, playwright won't see the libs but it'll work
        # anyways. This skips the check. Honestly this might be shady and bite
        # me in the ass later.
        PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = true;
      };
      checks = {
        alejandra =
          pkgs.runCommand "alejandra" {
            buildInputs = [pkgs.alejandra];
          } ''
            alejandra -c ${./.}
            mkdir $out
          '';
        devShell = devShells.default;
      };
    });
}
