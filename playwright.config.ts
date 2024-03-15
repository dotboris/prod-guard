import { defineConfig } from '@playwright/test'

export default defineConfig({
  testMatch: 'e2e/*.test.ts',
  expect: {
    toHaveScreenshot: {
      // On dev machines & on the CI some font smoothing settings are not quite
      // the same and so there are subtle differences in the screenshots.
      maxDiffPixelRatio: 0.02,
    },
  },
})
