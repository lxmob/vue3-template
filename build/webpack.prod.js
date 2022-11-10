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
      // https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunkscachegroups
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(s?css|less|sass)$/,
          chunks: 'all',
          enforce: true,
          priority: 10
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendors',
          chunks: 'all',
          minChunks: 2,
          chunks: 'initial',
          minSize: 0,
          priority: 1,
          enforce: true,
          reuseExistingChunk: true
        },
        commons: {
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
      // https://github.com/jantimon/html-webpack-plugin#minification
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      inject: true // 自动注入静态资源
    }),
    // 复制静态资源到指定目录
    // https://webpack.js.org/plugins/copy-webpack-plugin/
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          globOptions: {
            ignore: ['.*']
          },
          filter: source => !source.includes('index.html') // 忽略index.html
        }
      ]
    }),
    // 抽离css
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].css'
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
    hints: false,
    maxAssetSize: 512000,
    maxEntrypointSize: 512000
  }
})
