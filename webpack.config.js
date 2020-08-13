const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function isProd () {
  return process.env.NODE_ENV === 'production'
}

module.exports = {
  mode: isProd() ? 'production' : 'development',

  context: path.resolve(__dirname, 'src'),
  entry: {
    'content-script': './content-script',
    background: './background',
    popup: './popup'
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        'manifest.json'
      ]
    }),
    new HtmlWebpackPlugin({
      chunks: ['popup'],
      filename: 'popup.html',
      title: 'Prod Guard Settings'
    })
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: [
          // 'raw-loader'
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devtool: 'source-map'
}
