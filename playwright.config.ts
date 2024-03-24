import { defineConfig } from '@playwright/test'

export default defineConfig({
  testMatch: 'e2e/*.test.ts',
  use: {
    trace: 'on',
  },
  expect: {
    toHaveScreenshot: {
      // There are slight differences in font rendering between the CI
      // environment and developer desktop environments. This makes the diff a
      // bit more tolerant.
      threshold: 0.4,
    },
  },
})
