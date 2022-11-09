// webpack.prod.conf.js
const path = require('path')
const config = require('../config')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const glob = require('glob') // 文件匹配模式
const PATHS = {
  src: path.join(__dirname, 'src')
}

/* 生产环境配置 */
module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  optimization: {
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js webpack5内置该插件，如果采用pnpm为了解决幽灵依赖问题，需手动安装此插件 pnpm i terser-webpack-plugin -D
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // 删除console.log
          }
        }
      })
    ],
    splitChunks: {
      // 分隔代码
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(s?css|less|sass)$/,
          chunks: 'all',
          enforce: true,
          priority: 10
        },
        vendors: {
          // 提取第三方依赖代码
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendors',
          chunks: 'all',
          // 只要使用两次就提取出来
          minChunks: 2,
          // 只提取初始化就能获取到的模块,不管异步的
          chunks: 'initial',
          // 提取代码体积大于0就提取出来
          minSize: 0,
          // 提取优先级为1
          priority: 1,
          enforce: true,
          reuseExistingChunk: true
        },
        commons: {
          // 提取页面公共代码
          name: 'chunk-commons',
          chunks: 'all',
          minChunks: 2,
          chunks: 'initial',
          minSize: 0,
          enforce: true,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true, // 自动注入静态资源
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      // 决定了 script 标签的引用顺序。默认有四个选项，'none', 'auto', 'dependency', '{function}'
      chunksSortMode: 'auto'
    }),
    // 复制静态资源到指定目录
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          globOptions: {
            ignore: ['.*']
          },
          // 忽略index.html
          filter: source => !source.includes('index.html')
        }
      ]
    }),
    // 抽离css
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    // 清理无用css
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      extractors: [
        {
          extractor: class Extractor {
            static extract(content) {
              const validSection = content.replace(/<style([\s\S]*?)<\/style>+/gim, '')
              return validSection.match(/[A-Za-z0-9-_:/]+/g) || []
            }
          },
          extensions: ['html', 'vue']
        }
      ],
      // 保留白名单
      safelist: [
        /el-.*/,
        /html|body/,
        /data-v-.*/,
        /^router-link(|-exact)-active$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /-(leave|enter|appear)(|-(to|from|active))$/
      ]
    })
  ],
  performance: {
    hints: 'warning',
    maxAssetSize: 100000,
    maxEntrypointSize: 400000,
    // 只对打包后js文件超出体积警告
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js')
    }
  }
})
