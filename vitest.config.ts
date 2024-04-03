import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setup-tests.ts'],
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})
