const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

function isProd () {
  return process.env.NODE_ENV === 'production'
}

module.exports = {
  mode: isProd() ? 'production' : 'development',

  context: path.resolve(__dirname, 'src'),
  entry: {
    'content-script': './content-script',
    'background': './background'
  },

  plugins: [
    new CopyPlugin([
      'manifest.json'
    ])
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },

  devtool: 'source-map'
}
