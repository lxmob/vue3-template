const { merge } = require('webpack-merge')
const prodConfig = require('./webpack.prod.js')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// 通过smp分析构建打包速度
const smp = new SpeedMeasurePlugin()

const smpConfig = smp.wrap({
  plugins: [
    // 配置分析打包结果插件
    new BundleAnalyzerPlugin({
      analyzerPort: 8089,
      reportTitle: 'analyzer'
    })
  ]
})
// Error "You forgot to add 'mini-css-extract-plugin' plugin"
// https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
module.exports = merge(prodConfig, smpConfig)
