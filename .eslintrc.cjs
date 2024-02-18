module.exports = {
  root: true,

  env: {
    browser: true,
  },

  rules: {
    'react/prop-types': 'off',
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['standard-with-typescript'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      extends: ['standard'],
    },
    {
      files: ['**/*.tsx', '**/*.jsx'],
      extends: ['standard-jsx', 'plugin:react-hooks/recommended'],
    },
    {
      // This on needs to be applied at the end because it disables stuff from
      // the configs extended above.
      files: ['**/*'],
      extends: ['prettier'],
    },
  ],
}
