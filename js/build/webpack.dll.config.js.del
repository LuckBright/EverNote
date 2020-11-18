const path = require('path');
const webpack = require('webpack');
var config = require('../config')
var utils = require('./utils')
var vueLoaderConfig = require('./vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: {
    vendor: [
      'axios',
      'vue',
      'vuex',
      'chalk',
      'element-ui',
      'moment',
      'nprogress',
      'table2excel',
      'v-charts',
      'vue-moment',
      'vue-router',
      'vuedraggable',
      'webcamjs',
      'chart.js',
      'animate.css',
      'normalize.css',
      'vue2-animate/dist/vue2-animate.min.css',
      'nprogress/nprogress.css',
      'vue-cropper',
      'js-base64',
      '@chenfengyuan/vue-barcode',
      '@chenfengyuan/vue-qrcode',
      'lodash',
      '@livelybone/vue-select/lib/css/index.scss']
  },
  output: {
    path: path.join(__dirname, '../static/'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'stompjs': resolve('node_modules') + '/stompjs/lib/stomp.js',
      'ufilejs': resolve('src') + '/assets/ufile/ufile.js',
      'ytxjs': resolve('src') + '/assets/ytx/ytx.js',
      'jcpjs': resolve('src') + '/assets/jatool/jcp.js'
    }
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    }).concat({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    }).concat({
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    }).concat([
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ])
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
        if (chunk.name) {
            return chunk.name;
        }
        return chunk.modules.map(m => path.relative(m.context, m.request)).join("_");
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, '../static/', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('../[name].css')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // drop_debugger: true, // 自动删除debugger
        // drop_console: true // 自动删除console.log
      },
      sourceMap: true
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en/)
  ]
}