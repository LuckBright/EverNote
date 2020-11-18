require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var run = require('parallel-webpack').run
var config = require('../config')
var webpackConfigs = require.resolve('./entry')
var spinner = ora('building for production...')
console.log('ENTRY_LIST 有效值为： ' + Object.keys(config.entryObj).join(','))
spinner.start()
rm(path.join(config.build.assetsRoot, '/*'), err => {
  if (err) throw err
  console.log('entry: ', process.env.entry && process.env.entry.split(','))
  run(webpackConfigs, {
    watch: false,
    maxRetries: 1,
    maxConcurrentWorkers: 10 // use 2 workers
  }, function (err, stats) {
    spinner.stop()
    if (err) throw err
    // stats.stats.map(stat => {
    //   console.log('==================================')
    //   process.stdout.write(stat.toString({
    //     colors: true,
    //     modules: false,
    //     children: false,
    //     chunks: false,
    //     chunkModules: false
    //   }) + '\n\n')
    // })
    console.log(arguments)
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
