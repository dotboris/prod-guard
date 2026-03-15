# Changelog

## 2.1.0

### Minor Changes

- [#1299](https://github.com/dotboris/prod-guard/pull/1299) [`c8b77a7`](https://github.com/dotboris/prod-guard/commit/c8b77a7f58205f613cd6369f90183c4a305ba1ea) Thanks [@dotboris](https://github.com/dotboris)! - Redesign the whole UI. The new UI looks better and is easier to use.

- [#1311](https://github.com/dotboris/prod-guard/pull/1311) [`74bf394`](https://github.com/dotboris/prod-guard/commit/74bf394bc7b5f12cfa8b4a01a78b1103782eab88) Thanks [@dotboris](https://github.com/dotboris)! - Surface load time errors to users.

## 2.0.2

### Patch Changes

- [#1287](https://github.com/dotboris/prod-guard/pull/1287) [`fbeaa58`](https://github.com/dotboris/prod-guard/commit/fbeaa583183f981a6edb062e173cd39194e71895) Thanks [@edwardloveall](https://github.com/edwardloveall)! - Fix warnings disappearing on sites that implement navigation by replacing the content of the page with Javascript.

## 2.0.1

### Patch Changes

- [#1122](https://github.com/dotboris/prod-guard/pull/1122) [`af94d16`](https://github.com/dotboris/prod-guard/commit/af94d16f2ac7f6e6bf230383f423d415c0efcb87) Thanks [@dotboris](https://github.com/dotboris)! - Set minimum version of Chrome to 121. This is the first version of Chrome that ignores the `background.scripts` property in `manifest.json`. We need this property to be ignored because we distribute this extension in Firefox which requires this key.

- [#1122](https://github.com/dotboris/prod-guard/pull/1122) [`af94d16`](https://github.com/dotboris/prod-guard/commit/af94d16f2ac7f6e6bf230383f423d415c0efcb87) Thanks [@dotboris](https://github.com/dotboris)! - Set minimum version of Firefox to 112. This is the first version version of Firefox to support both Manifest v3 and the `background.type` property.

- [#1118](https://github.com/dotboris/prod-guard/pull/1118) [`4d6325b`](https://github.com/dotboris/prod-guard/commit/4d6325bc456a208584fd8badfdba78e609a21590) Thanks [@renovate](https://github.com/apps/renovate)! - Give icons accessible labels based their titles

## 2.0.0

### Major Changes

- [#1004](https://github.com/dotboris/prod-guard/pull/1004) [`54aad0d`](https://github.com/dotboris/prod-guard/commit/54aad0d0a22fcf9c08978ac6e6d3c8144abbd1c7) Thanks [@dotboris](https://github.com/dotboris)! - Migrate to Manifest v3

  This is considered a **breaking change** because a change in the web extension
  permission model might require some users to accept new permissions. To resolve
  this, **simply open the Prod Guard popup**. If you have new permissions to
  accept, you'll see a yellow warning guiding you through the process.

  The permission in question is "Access data for all websites". We use this
  permission to inject the warnings that you have configured. Note that this is
  not a new permission. In Manifest v2, this permission was granted to use
  automatically when you installed Prod Guard. In Manifest v3, browsers may no
  longer grant this permission implicitly. From our testing, we've seen this
  behavior in Firefox.

### Patch Changes

- [#1092](https://github.com/dotboris/prod-guard/pull/1092) [`5bf3f7b`](https://github.com/dotboris/prod-guard/commit/5bf3f7b48369a696b490aa41e311504fd5a0b31f) Thanks [@dotboris](https://github.com/dotboris)! - Change the font family to Roboto and the font size to `16px`. Previously the font was not set and would therefore default to whatever the browser had. This ensures a more consistent look and feel across browsers and platforms.

## 1.5.1

### Patch Changes

- [#1036](https://github.com/dotboris/prod-guard/pull/1036) [`3ad8c34`](https://github.com/dotboris/prod-guard/commit/3ad8c34b62cfee6eb6fcf5fed1bfc7e3b607ee84) Thanks [@dotboris](https://github.com/dotboris)! - Fix issue where long URL patterns would overflow off the popup. This lead to the icons next to the pattern being hidden.

## 1.5.0

### Minor Changes

- [#1016](https://github.com/dotboris/prod-guard/pull/1016) [`435bdc7`](https://github.com/dotboris/prod-guard/commit/435bdc7190a54e9f9e38822a18b0e5e0d5f795f3) Thanks [@dotboris](https://github.com/dotboris)! - Warning can now be toggled on & off. Warnings that are toggled off don't get injected into pages.

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
