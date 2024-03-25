import { defineConfig } from '@playwright/test'

export default defineConfig({
  testMatch: 'e2e/*.test.ts',
  use: {
    trace: 'on',
  },
  webServer: {
    command: 'pnpm example',
    url: 'http://localhost:7000',
    reuseExistingServer: process.env.CI == null,
  },
})
