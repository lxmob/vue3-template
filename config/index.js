const path = require('path')

module.exports = {
  /* 编译生产模式 */
  build: {
    // path
    assetsSubDirectory: 'static',
    assetsPublicPath: '/' /* 资源公共文件 */,

    assetsRoot: path.resolve(__dirname, '../dist') /* 输出文件夹--通常是build */,

    productionSourceMap: false, // 是否生成sourcemap
    devtool: 'source-map'
  },
  /* 编译开发模式 */
  dev: {
    assetsSubDirectory: 'static' /* 静态文件资源 */,
    assetsPublicPath: '/',

    /* 跨域 */
    proxyTable: {},
    // 服务器设置
    host: '127.0.0.1',
    port: 8080,
    autoOpenBrowser: false /* 是否自动打开浏览器 */,
    errorOverlay: true /* 代码错误是否覆盖全屏浏览器上 */,
    notifyOnErrors: true /* 开启错误提示 */,

    showEslintErrorsInOverlay: true, // eslint错误是否显示在console终端上
    useEslint: true /* 是否使用eslint */,

    /**
     * Source Maps https://webpack.js.org/configuration/devtool/#devtool
     */
    devtool: 'eval-cheap-module-source-map' /* 开发者控制台的信息如何展示 */,

    /* CSS Sourcemaps */
    cssSourceMap: false /* 是否生成css文件map */
  }
}
