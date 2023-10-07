# Changelog

## 1.4.0

### Minor Changes

- [#1008](https://github.com/dotboris/prod-guard/pull/1008) [`bbbe2ad`](https://github.com/dotboris/prod-guard/commit/bbbe2adb425a5936b397f9ba5ad57435691d163d) Thanks [@dotboris](https://github.com/dotboris)! - Allow users to import data into Prod Guard. This can be done through the new settings menu. Settings are accessible in the popup by clicking the cog icon on the top right.

- [#999](https://github.com/dotboris/prod-guard/pull/999) [`fcfde78`](https://github.com/dotboris/prod-guard/commit/fcfde78e7b69a37d90444b52ddac4b6e68ed70e9) Thanks [@dotboris](https://github.com/dotboris)! - Allow users to export all of Prod Guard's data. This can be done through the new settings menu. Settings are accessible in the popup by clicking the cog icon on the top right.

### Patch Changes

- [#988](https://github.com/dotboris/prod-guard/pull/988) [`cd4a8c0`](https://github.com/dotboris/prod-guard/commit/cd4a8c0199901e83f621f6ade6c91b783bf0db49) Thanks [@dotboris](https://github.com/dotboris)! - Fix bug where internal state migration process would replace already configured settings for warnings with their default values.

- [#991](https://github.com/dotboris/prod-guard/pull/991) [`16566e9`](https://github.com/dotboris/prod-guard/commit/16566e97e66ea92e1652f11569c90a853bec1d17) Thanks [@renovate](https://github.com/apps/renovate)! - Update all non-major dependencies

- [#998](https://github.com/dotboris/prod-guard/pull/998) [`3d1f781`](https://github.com/dotboris/prod-guard/commit/3d1f7819c80bd8cc4cc6ec9b267583402948f7ac) Thanks [@dotboris](https://github.com/dotboris)! - Fix a bug where the color fields of a warning could be set to a blank value. The color fields are now all required when creating / editing a warning.

## 1.3.1

### Fixed

- Fix bug where banners would stay invisible or partially visible when mouse
  leaves the window. [#774](https://github.com/dotboris/prod-guard/issues/774)

### Changed

- Rename the `master` branch to `main`. This should have 0 impact on end users
  but it's worth mentioning.

## 1.3.0

### Added

- Top and bottom banners now automatically hide themselves when the mouse gets
  close. This allows you to see what's underneath a banner and to click or
  interact with the parts of the page that would be under the banner.

### Changed

- Change internal IDs from temporary integers to permanent UUIDs. This is an
  internal change that should not have any effect on users. This change is in
  preparation for adding an import/export feature.

## 1.2.0

### Added

- It is now possible to change the text for the "Top Banner" and "Bottom Banner"
  style warnings.
- It is now possible to change the colors of all warnings.

### Changed

- Migrate the whole build process to Webpack 5. This should have no impact on
  end users but it's worth mentioning.
- Migrate tests to Jest. This should have no impact on end users but it's worth
  mentioning.
- Migrate codebase from Vue.js to React. This should have no impact on end users
  but it's worth mentioning.

## 1.1.1

### Fixed

- Fixed major bug where loading, adding, removing, changing warnings did not
  work at all but only on the published version of the extension. It works in
  dev but it falls flat when it's published for real.

## 1.1.0

### Added

- Added support for Chrome & Chromium

## 1.0.0

### Added

- Ability to add warning to websites based regular expressions.
- Top Banner style warning.
- Bottom Banner style warning.
- Border style warning.
- Interface for managing warnings.
