const { version } = require('./package.json')
const path = require('path')
const sharp = require('sharp')
const CopyPlugin = require('copy-webpack-plugin')
const CleanPlugin = require('webpack-clean-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ICON_SIZES = [16, 24, 32, 48, 64, 96, 128]

function isProd() {
  return process.env.NODE_ENV === 'production'
}

function patchManifest(manifestContent) {
  const manifest = JSON.parse(manifestContent)

  let darkIcons = ICON_SIZES.map((size) => [
    String(size),
    pngIconPath('dark', size),
  ])
  darkIcons = Object.fromEntries(darkIcons)

  const themeIcons = ICON_SIZES.map((size) => ({
    size,
    light: pngIconPath('light', size),
    dark: pngIconPath('dark', size),
  }))

  manifest.version = version
  manifest.icons = darkIcons
  manifest.browser_action.default_icon = darkIcons
  manifest.browser_action.theme_icons = themeIcons

  return JSON.stringify(manifest)
}

function pngIconPath(type, size) {
  return `icon/icon-${type}-${size}.png`
}

function copyPluginIconPatterns() {
  const res = ['dark', 'light'].flatMap((type) =>
    ICON_SIZES.map((size) => {
      return {
        from: `icon/${type}-icon.svg`,
        to: pngIconPath(type, size),
        async transform(content) {
          return sharp(content).resize(size).png().toBuffer()
        },
      }
    })
  )

  return res
}

module.exports = {
  mode: isProd() ? 'production' : 'development',

  context: path.resolve(__dirname, 'src'),
  entry: {
    'content-script': './content-script',
    background: './background',
    popup: './popup',
  },

  plugins: [
    new CleanPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: 'manifest.json',
          transform(content) {
            return patchManifest(content)
          },
        },
        ...copyPluginIconPatterns(),
      ],
    }),
    new HtmlWebpackPlugin({
      chunks: ['popup'],
      filename: 'popup.html',
      title: 'Prod Guard Settings',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset/source',
      },
      {
        test: /\.svg$/,
        resourceQuery: /data-uri/,
        type: 'asset/inline',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  devtool: 'source-map',
}
