const { version } = require('./package.json')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const CleanPlugin = require('webpack-clean-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

function isProd () {
  return process.env.NODE_ENV === 'production'
}

function patchManifest (manifestContent) {
  const manifest = JSON.parse(manifestContent)
  manifest.version = version
  return JSON.stringify(manifest)
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
    new CleanPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: 'manifest.json',
          transform (content) {
            return patchManifest(content)
          }
        },
        'icon/*.svg'
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
          'raw-loader'
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devtool: 'source-map'
}
