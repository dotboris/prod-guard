module.exports = {
  extends: [
    'standard',
    'standard-jsx',
    'plugin:react-hooks/recommended',
    'prettier',
  ],

  env: {
    browser: true,
  },

  rules: {
    'react/prop-types': 'off',
  },

  overrides: [
    {
      files: ['**/*.test.js'],
      extends: ['plugin:jest/recommended'],
    },
  ],
}
