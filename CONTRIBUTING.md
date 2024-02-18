# How to contribute

## Development

### Dependencies

You'll need the following dependencies installed on your system:

- Nodejs (any modern version should do)
- pnpm
- A browser to test on (Firefox, Chrome, Chromium, etc.)

### Setup

```sh
pnpm
```

### Build

```sh
pnpm build
# or
pnpm build:prod
```

### Run

1. In one terminal start the watch build

    ```sh
    pnpm build:watch
    ```

1. In another terminal start a browser with the extension loaded

    ```sh
    pnpm start
    ```

### Test

```sh
# Watch
pnpm test
# Single run
pnpm test --single-run
```

### Lint

```sh
pnpm build
pnpm lint
```

### Package

This is usually not required for normal development. Here are the instructions
in case you need them.

```sh
pnpm package
```

## Release

Versioning & the changelog are handled by [changesets](https://github.com/changesets/changesets).

1.  Look for a PR named "Prepare Release (changsets automation)"
1.  Make sure the changes are good / what you expect
1.  The CI doesn't run automatically because of limitations wit GHA. You can
    force it to run by manually starting the
    [Prepare Release](./.github/workflows/prepare-release.yml) workflow
    (targeting `main`).
1.  Merge the PR
1.  The [main branch](./.github/workflows/main.yml) workflow will create a
    release for you.
1.  This release will hold the compiled version of the extension. Download it.
1.  Publish to the Firefox add-ons site
1.  Publish to the Chrome web store
