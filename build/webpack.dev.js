// webpack.dev.conf.js
const path = require('path')
const config = require('../config')
const pkg = require('../package.json')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

/* 开发环境配置 */
const devWebpackConfig = merge(baseConfig, {
  mode: 'development',
  devtool: config.dev.devtool,
  devServer: {
    // https://webpack.docschina.org/configuration/dev-server/
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
        }
      ]
    },
    hot: true,
    compress: false,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    client: {
      overlay: config.dev.errorOverlay
        ? {
            warnings: false,
            errors: true
          }
        : false
    },
    static: {
      directory: path.join(__dirname, '../public') // 托管静态资源public文件夹
    },
    proxy: config.dev.proxyTable
  },
  // https://webpack.js.org/configuration/stats/
  // 消除终端输出log，只当发生警告和错误时才输出
  stats: {
    preset: 'errors-warnings'
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true
    })
  ]
})

// 错误信息回调
const createNotifierCallback = function () {
  const notifier = require('node-notifier')
  return (severity, errors) => {
    if (severity !== 'error') {
      return
    }
    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()
    notifier.notify({
      title: pkg.name,
      message: severity + ': ' + error.name,
      subtitle: filename || ''
    })
  }
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = config.dev.port // 端口被占用 +1
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      devWebpackConfig.devServer.port = port // 替换端口
      devWebpackConfig.plugins.push(
        // 添加友好的信息提示
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
          },
          onErrors: config.dev.notifyOnErrors ? createNotifierCallback() : undefined,
          clearConsole: true
        })
      )
      resolve(devWebpackConfig)
    }
  })
})
