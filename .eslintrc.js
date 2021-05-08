module.exports = {
  extends: [
    'standard',
    'standard-jsx'
  ],
  env: {
    browser: true,
    webextensions: true
  },

  overrides: [
    {
      files: ['**/*.test.js'],
      extends: ['plugin:jest/recommended']
    }
  ]
}
