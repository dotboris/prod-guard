module.exports = {
  extends: [
    'standard-with-typescript',
    'standard-jsx',
    'plugin:react-hooks/recommended',
    'prettier',
  ],

  env: {
    browser: true,
  },

  parserOptions: {
    project: './tsconfig.json',
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
