/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',

  transformIgnorePatterns: [
    // Normally jest avoid transforming anything in node_modules.
    // Some modules need to be transformed (ex: es modules)
    '<rootDir>/node_modules/.pnpm/(?!(lodash-es)@)',
  ],

  moduleNameMapper: {
    // mock out all scss files
    '\\.scss$': '<rootDir>/src/__mocks__/scss.js',
  },
}

module.exports = config
