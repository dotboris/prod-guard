/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',

  transformIgnorePatterns: [
    // Normally jest avoid transforming anything in node_modules.
    // Some modules need to be transformed (ex: es modules)
    '<rootDir>/node_modules/.pnpm/(?!(lodash-es)@)',
  ],
}

module.exports = config
