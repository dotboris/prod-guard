import { defineConfig } from '@playwright/test'

export default defineConfig({
  testMatch: 'e2e/*.test.ts',
  use: {
    trace: 'on',
  },
})
