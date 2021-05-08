module.exports = {
  extends: [
    'standard',
    'standard-jsx',
    'standard-react'
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
