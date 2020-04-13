const webpackConfig = require('./webpack.config')

module.exports = function (config) {
  webpackConfig.devtool = 'inline-source-map'

  config.set({
    frameworks: ['mocha'],

    reporters: ['mocha'],
    mochaReporter: {
      showDiff: true
    },

    files: [
      { pattern: 'test/**/*.test.js', watched: false }
    ],

    preprocessors: {
      'test/**/*.test.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },

    browsers: [
      'ChromiumHeadless',
      'FirefoxHeadless'
    ]
  })
}
