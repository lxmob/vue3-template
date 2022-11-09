// webpack.dev.conf.js
const path = require('path')
const config = require('../config')
const pkg = require('../package.json')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') // 友好的错误提示插件
const portfinder = require('portfinder') // 端口被占用 +1

/* 开发环境配置 */
const devWebpackConfig = merge(baseConfig, {
  mode: 'development',
  devtool: config.dev.devtool,
  devServer: {
    /* 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html */
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
        }
      ]
    },
    hot: true /* 热更新 */,
    compress: false /* gzip开发环境不开启，提升hmr更新速度 */,
    host: config.dev.host /* 域名 */,
    port: config.dev.port /* 端口 */,
    open: config.dev.autoOpenBrowser /* 是否自动打开浏览器 */,
    client: {
      overlay: config.dev.errorOverlay
        ? {
            warnings: false /* 警告不覆盖 */,
            errors: true /* 错误全屏覆盖 */
          }
        : false /* 当出现编译器错误或警告时，在浏览器中显示全屏覆盖。默认情况下禁用。如果您只想显示编译器错误 */
    },
    static: {
      /* 托管静态资源public文件夹 */
      directory: path.join(__dirname, '../public')
    },
    proxy: config.dev.proxyTable /* 跨域配置 */
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

/* 错误信息回调 */
const createNotifierCallback = function () {
  /* 系统级别的消息 */
  const notifier = require('node-notifier')

  return (severity, errors) => {
    /* 类型不是error就直接return */
    if (severity !== 'error') {
      return
    }
    /* 获取第一个错误 */
    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()
    notifier.notify({
      title: pkg.name /* 项目名称 */,
      message: severity + ': ' + error.name /* 级别+错误信息 */,
      subtitle: filename || '' /* 错误文件 */
      // icon: path.join(__dirname, 'logo.png') /* logo */,
    })
  }
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      // process.env.PORT = port
      // 替换端口
      devWebpackConfig.devServer.port = port
      // 添加有好的信息提示
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors ? createNotifierCallback() : undefined,
          clearConsole: true
        })
      )
      /* 返回开发配置 */
      resolve(devWebpackConfig)
    }
  })
})
