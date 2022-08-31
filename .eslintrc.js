module.exports = {
  extends: [
    'standard',
    'standard-jsx',
    'plugin:react-hooks/recommended'
  ],

  env: {
    browser: true
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
