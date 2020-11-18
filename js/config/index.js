// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
let entryObj = {
  // 平台业务 fe-pingtai
  index: './src/login', // 登录注册，找回密码帮助中心等
  demo: './src/demo', // 组件样例工作站
  systemset: './src/systemset', // 系统配置工作站
  // 供应链业务 fe-warehouse
  manages: './src/manages', // 集团管理工作站
  ihsystem: './src/ihsystem', // 互联网医生管理工作站
  // group: './src/warehouse/page/group', // 集团工作站
  warehouse: './src/warehouse', // 库房工作站 综合运营工作站（名字叫的忒歧义） 机构设置工作站
  html5: './src/html5', // 移动护理的部分页面
  // 财务业务 fe-rcm
  rcm: './src/rcm', // 门诊收费工作站 住院事务管理工作站 价格体系工作站 财务会计工作站 管理会计工作站 财务设置工作站
  // 会员营销业务 fe-yingxiao
  card: './src/card', // 营销工具工作站
  crm: './src/crm', // 客服工作站 健康管理工作站
  follow: './src/follow', // 随访工作站
  // 临床业务 fe-linchuang
  yihu: './src/workspace', // 门急诊医生工作站
  hospital: './src/inpatient', // 住院医生工作站 住院护士工作站 病案管理工作站
  csa: './src/csa', // 手术管理工作站
  infusion: './src/infusion', // 医技工作站
  quality:'./src/qualitycontrol/',// 质控管理工作站
  kanban: './src/kanban', // 综合业务
  adt: './src/adt', // 住院事物管理工作站
  phr: './src/phr', // phr
  // 第三方对接平台
  order: './src/order', // 订单数据工作站
  hi: './src/healthinsurance', // 医保工作站
  titancare: './src/titancare', // 互联网管理工作站
  titanmall: './src/titanmall', // 商城管理工作站
  bi: './src/bi', // 统计分析工作站
}

module.exports = {
  entryObj: entryObj,
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    filePublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    filePublicPath: './',
    proxyTable: {
      '/api': {
        target: 'http://dev4a.everjiankang.com.cn/api',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      },
      '/web': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/web': '' }
      },
      // 帮助中心属于单独项目，需要联调请修改到对应的项目地址
      '/help': {
        target: 'http://localhost:8082/web/',
        changeOrigin: true,
        // pathRewrite: { '^/web/help/index.html': '' }
      },
      // 互联网医院转发地址，为了解决不同端口下localstorage共享问题
      // '/titan-care': {
      //   target: 'http://localhost:5000/web/',
      //   changeOrigin: true,
      //   // pathRewrite: { '^/web/help/index.html': '' }
      // },
      // 商城管理转发地址，为了解决不同端口下localstorage共享问题
      // '/titan-mall-backstage': {
      //   target: 'http://localhost:5001/web/',
      //   changeOrigin: true,
      //   // pathRewrite: { '^/web/help/index.html': '' }
      // },
      '/comp': {
        target: 'http://localhost:7000/#/demo',
        changeOrigin: true,
        // pathRewrite: { '^/web/help/index.html': '' }
      },
      '/WebReport': {
        target: 'http://fanruan.dev.everjiankang.com.cn/',  //目标接口域名
        changeOrigin: true
      },
      '/idcardauto': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        pathRewrite: {
          '^/idcardauto': '/'
        }
      },
      '/testserial': {
        target: 'http://192.168.200.146:9099',
        changeOrigin: true,
        pathRewrite: {
          '^/testserial': '/'
        }
      },
      '/localtest': {
        target: 'http://192.168.249.186:9412',
        changeOrigin: true,
        pathRewrite: {
          '^/localtest': '/'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
