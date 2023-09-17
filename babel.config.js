module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
  ],
  plugins: ['@emotion'],
}
