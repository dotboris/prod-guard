# Changelog

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
