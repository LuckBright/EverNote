const path = require('path')
const webpack = require('webpack')
var fs = require("fs")
var config = require('../config')
var utils = require('./utils')
var vueLoaderConfig = require('./vue-loader.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var tplHtml = path.join(__dirname, '../index.html')
var baseDir = path.join(__dirname, '../static/base/')
fsDelete(tplHtml)
fsDelete(baseDir)

function fsDelete (path) {
  if (!fs.existsSync(path)) return
  var info = fs.statSync(path)
  if (info.isDirectory()) {
    var data = fs.readdirSync(path)
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        fsDelete(`${path}/${data[i]}`);
        if (i == data.length - 1) {
          fsDelete(`${path}`)
        }
      }
    } else {
      fs.rmdirSync(path)
    }
  } else if (info.isFile()) {
    fs.unlinkSync(path)
  }
}

module.exports = {
  entry: {
    basemain: [
      './src/main'
    ]
  },
  output: {
    path: path.join(__dirname, '../static/base/'),
    filename: '[name].dll.[chunkhash].js',
    library: '[name]_library'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'stompjs': resolve('node_modules') + '/stompjs/lib/stomp.js',
      // 'ufilejs': resolve('src') + '/assets/ufile/ufile.js',
      // 'ytxjs': resolve('src') + '/assets/ytx/ytx.js',
      'jcpjs': resolve('src') + '/assets/jatool/jcp.js'
    }
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      minimize: true
    }).concat({
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    }).concat({
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[ext]')
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
          name: utils.assetsPath('img/[name].[ext]')
        }
      }
    ])
  },
  plugins: [
    // new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.modules.map(m => path.relative(m.context, m.request)).join("_");
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, '../static/base/', '[name]-manifest.json'),
      name: '[name]_library'
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('../[name].[contenthash].css')
    }),
    new HtmlWebpackPlugin({
      filename: '../../index.html',
      template: 'static/index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true, // 自动删除debugger
        // drop_console: true // 自动删除console.log
      },
      sourceMap: true
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en/)
  ]
}