# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Migrate the whole build process to Webpack 5. This should have no impact on
  end users but it's worth mentioning.
- Migrate tests to Jest. This should have no impact on end users but it's worth
  mentioning.
- Migrate codebase from Vue.js to React. This should have no impact on end users
  but it's worth mentioning.

## v1.1.1 - 2020-08-18

### Fixed

- Fixed major bug where loading, adding, removing, changing warnings did not
  work at all but only on the published version of the extension. It works in
  dev but it falls flat when it's published for real.

## v1.1.0 - 2020-08-16

### Added

- Added support for Chrome & Chromium

## v1.0.0 - 2020-08-16

### Added

- Ability to add warning to websites based regular expressions.
- Top Banner style warning.
- Bottom Banner style warning.
- Border style warning.
- Interface for managing warnings.
