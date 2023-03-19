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
pnpm format:check
```

### Package

This is usually not required for normal development. Here are the instructions
in case you need them.

```sh
pnpm package
```

## Release

1.  Checkout `main` and make sure that you have a clean environment.
1.  Update the [changelog](CHANGELOG.md)

    You'll need to change the `Unreleased` section to the version you're about
    to release and create a new empty `Unreleased` section.

    Once that's done, commit this change directly to `main`.

1.  Bump the version.

    ```sh
    pnpm version
    ```

1.  Push your version bump and changelog update.

    ```sh
    git push --tags origin main
    ```

1.  Build & package the extension.

    ```sh
    pnpm build:prod
    pnpm package
    ```

    This step creates a fully packaged extension in `web-ext-artifacts/`. You
    may have old versions from previous builds. Be sure to use the right version
    when publishing.

1.  Publish to the Firefox add-ons site.
1.  Publish to the Chrome web store
