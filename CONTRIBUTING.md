# Contributing Guidelines

## Guide

## Cheat Sheet

### Dependencies

You'll need the following dependencies installed on your system:

- Nodejs (any modern version should do)
- Yarn
- A browser to test on (Firefox, Chrome, Chromium, etc.)

### Setup

```sh
yarn
```

### Build

```sh
yarn build
# or
yarn build:prod
```

### Run

1. In one terminal start the watch build

    ```sh
    yarn build:watch
    ```

1. In another terminal start a browser with the extension loaded

    ```sh
    yarn start
    ```

### Test

```sh
# Watch
yarn test
# Single run
yarn test --single-run
```

### Lint

```sh
yarn build
yarn lint
```

### Package

This is usually not required for normal development. Here are the instructions
in case you need them.

```sh
yarn package
```

## Release

1.  Checkout `master` and make sure that you have a clean environment.
1.  Update the [changelog](CHANGELOG.md)

    You'll need to change the `Unreleased` section to the version you're about
    to release and create a new empty `Unreleased` section.

    Once that's done, commit this change directly to `master`.

1.  Bump the version.

    ```sh
    yarn version
    ```

1.  Push your version bump and changelog update.

    ```sh
    git push --tags origin master
    ```

1.  Build & package the extension.

    ```sh
    yarn build:prod
    yarn package
    ```

    This step creates a fully packaged extension in `web-ext-artifacts/`. You
    may have old versions from previous builds. Be sure to use the right version
    when publishing.

1.  Publish to the Firefox add-ons site.
1.  Publish to the Chrome web store
