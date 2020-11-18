/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-11-06 14:53:47
 * @LastEditTime: 2020-11-17 20:17:32
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
// const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin")
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var path = require('path')
module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  devServer: {
    before (app) {
      app.use('/__open-in-editor', openInEditor('code'))
    }
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    // 如果需要调试main.js里面的文件，把这个注释掉就不用重新打包了，修改立刻生效。上线的时候记得改回去
    // new webpack.DllReferencePlugin({
    //   context: path.join(__dirname, ".."),
    //   manifest: require('../static/base/basemain-manifest')
    // }),
    new webpack.DefinePlugin({
      'process.env': merge(config.dev.env, {
        host: JSON.stringify(process.env.host),
        entry: JSON.stringify(process.env.entry),
        clinic: JSON.stringify(process.env.clinic)
      })
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks: ['main'],
      inject: true
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin()
    // 删除无用文件脚本
    // new UnusedFilesWebpackPlugin({
    //   patterns: ['src/**']
    // })
  ]
})
