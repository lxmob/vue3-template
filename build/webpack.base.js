// webpack.base.conf.js
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const { VueLoaderPlugin } = require('vue-loader')

// 按需引入element组件
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const ElementPlus = require('unplugin-element-plus/webpack')

// 单独抽离css以link形式进行引入
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development'

// 解析路径
const resolve = dir => {
  return path.join(__dirname, '..', dir)
}

/* 基础配置 */
module.exports = {
  entry: resolve('src/main.js'),
  output: {
    clean: true, // webpack5内置打包前清空dist文件
    path: config.build.assetsRoot,
    publicPath: isDev ? config.dev.assetsPublicPath : config.build.assetsPublicPath,
    filename: 'static/js/[name].[chunkhash:8].js', // js文件比较适用chunkhash模式
    chunkFilename: 'static/js/[name].[chunkhash:8].js'
  },
  resolve: {
    alias: {
      '@': resolve('src')
    },
    extensions: ['.js', '.jsx', '.vue'],
    // 查找第三方插件时只在本项目中node_modules查找
    modules: [resolve('node_modules')]
  },
  module: {
    rules: [
      // 利用多核cpu开启多线程打包，大型项目下效果显著
      {
        test: /\.(js|jsx)$/,
        use: ['thread-loader', 'babel-loader'],
        exclude: /node_modules/,
        include: resolve('src')
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false
              },
              babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy']
            }
          }
        ]
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      // webpack5默认支持文件解析，不再使用file-loader,url-loader解析文件
      // https://webpack.js.org/guides/asset-modules/#root
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 小于10kb转为base64格式
          }
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]' // 文件输出目录和命名，静态资源比较适合contenthash模式
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/, // 匹配字体文件
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]'
        }
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]'
        }
      }
    ]
  },
  plugins: [
    // 注入业务代码定义环境变量
    new webpack.DefinePlugin({
      'process.env': isDev ? require('../config/dev.env') : require('../config/prod.env'),
      // https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    }),
    new VueLoaderPlugin(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({
      exclude: [/[\\/]node_modules[\\/]/],
      include: [/\.jsx$/, /\.vue$/, /\.vue\?vue/],
      resolvers: [ElementPlusResolver()]
    }),
    ElementPlus({ useSource: false })
  ],
  // webpack5持久化缓存节省下一次打包速度
  cache: {
    type: 'filesystem' // 使用文件缓存
  }
}
