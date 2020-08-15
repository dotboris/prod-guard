# Prod Guard

[![Build Status](https://travis-ci.com/dotboris/prod-guard.svg?branch=master)](https://travis-ci.com/dotboris/prod-guard)
[![Known Vulnerabilities](https://snyk.io/test/github/dotboris/prod-guard/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dotboris/prod-guard?targetFile=package.json)

Browser extension that lets you know when you're connected to production by
giving you a clear visual cue. Never accidentally make changes to production
ever again.

## Install

TODO: publish extension & give links here

## Usage

TODO: How to use / configure this extension

## Development

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

## Release

1.  Checkout `master` and make sure that you have a clean environment
1.  Bump the version

    ```sh
    yarn version
    ```

1.  Push your version bump

    ```sh
    git push --tags origin master
    ```

1.  Build & package the extension

    ```sh
    yarn build:prod
    yarn package
    ```

1.  Upload the packaged extension to the Firefox addons site

    Note that the previous step created a packaged extension for you to upload
    in `web-ext-artifacts/`. Make sure that you're uploading the right version!
