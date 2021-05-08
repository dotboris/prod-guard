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

  rules: {
    'react/prop-types': 'off'
  },

  overrides: [
    {
      files: ['**/*.test.js'],
      extends: ['plugin:jest/recommended']
    }
  ]
}
