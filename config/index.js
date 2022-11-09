const path = require('path')

module.exports = {
  build: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/', // 资源公共文件

    assetsRoot: path.resolve(__dirname, '../dist'),

    productionSourceMap: false, // 是否生成sourcemap
    devtool: 'source-map'
  },
  dev: {
    assetsSubDirectory: 'static', // 静态文件资源
    assetsPublicPath: '/',

    // 跨域
    proxyTable: {},
    // 服务器设置
    host: '127.0.0.1',
    port: 8080,
    autoOpenBrowser: false, // 是否自动打开浏览器
    errorOverlay: true, // 代码错误是否覆盖全屏浏览器上
    notifyOnErrors: true, // 开启错误提示

    devtool: 'eval-cheap-module-source-map',
    cssSourceMap: false
  }
}
