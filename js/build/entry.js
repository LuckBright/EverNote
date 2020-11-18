var prodConfig = require('./webpack.prod.conf')
var devConfig = require('./webpack.dev.conf')
var merge = require('webpack-merge')
var config = require('../config')
// var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')
let entryObj = config.entryObj
var utils = require('./utils')
function checkEntry (entry) {
  if (!getEntryDir(entry)) {
    throw '没有找到对应的入口文件 ' +
    entry +
    ', 有效值为 ' +
    Object.keys(entryObj).join(',')
  }
}

function createConfigs () {
  return process.env.NODE_ENV === 'production' ? createProd() : createDev()
}

function isRootDir (entryName) {
  return ['index'].indexOf(entryName) > -1
}

function getEntryDir (entry) {
  return entryObj[entry]
}

function createProd () {
  let entrys = process.env.entry ? process.env.entry.split(',') : Object.keys(entryObj)
  // demo模块不参与线上打包，411
  entrys = entrys.filter(item => {
    return item != 'demo'
  })
  let configs = entrys.map(v => {
    checkEntry(v)
    let obj = merge(prodConfig, {
      entry: {
        main: getEntryDir(v)
      },
      output: {
        path: isRootDir(v) ? config.build.assetsRoot : config.build.assetsRoot + '/' + v,
        publicPath: isRootDir(v) ? '/web/' : '/web/' + v + '/', // 目录机构调整后
        filename: utils.assetsPath('js/' + v + '.' + '[name].[chunkhash].js')
      }
    })
    return obj
  })
  return configs
}

function createDev () {
  let entrys = process.env.entry
    ? process.env.entry.split(',')
    : Object.keys(entryObj)
  let configs = entrys.map(v => {
    checkEntry(v)
    let obj = merge(devConfig, {
      name: v,
      entry: {
        main: [
          'webpack-hot-middleware/client?noInfo=true&reload=true&name=' + v
        ].concat(getEntryDir(v))
      },
      output: {
        path: isRootDir(v) ? config.build.assetsRoot : config.build.assetsRoot + '/' + v,
        filename: utils.assetsPath('js/' + v + '.' + '[name].js'),
        publicPath: isRootDir(v) ? '/' : '/' + v + '/'
      }
    })
    obj.plugins = devConfig.plugins.slice(0)
    obj.plugins.push(
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: './static',
        ignore: ['.*']
      }])
    )
    return obj
  })
  return configs
}

module.exports = createConfigs()
