import moment from 'moment'
import $store from './index'
import BASECONFIG from './config'
import { messageTips, formAutofocus } from '@/util/common'
import bus from '@/util/eventbus'
import staticvars from '@/store/staticvars'
import config from '@/store/config'

var ever = {}
var preFix = staticvars.prefix

var diction = {
  'yesno': [
    {
      id: 1,
      name: '是'
    },
    {
      id: 0,
      name: '否'
    }
  ],
  'mainIndex': preFix + '/#',
  'yihuIndex': preFix + '/yihu/index.html#',
  'warehouseIndex': preFix + '/warehouse/index.html#',
  'rcmIndex': preFix + '/rcm/index.html#',
  'cardIndex': preFix + '/card/index.html#',
  'crmIndex': preFix + '/crm/index.html#',
  'systemsetIndex': preFix + '/systemset/index.html#',
  'managesIndex': preFix + '/manages/index.html#',
  'adtIndex': preFix + '/adt/index.html#',
  'kanbanIndex': preFix + '/kanban/index.html#',
  'hospitalIndex': preFix + '/hospital/index.html#',
  'html5Index': preFix + '/html5/index.html#',
  'infusionIndex': preFix + '/infusion/index.html#',
  'followIndex': preFix + '/follow/index.html#',
  'helpIndex': preFix + '/help/index.html#',
  'hiIndex': preFix + '/hi/index.html#',
  'phrIndex': preFix + '/phr/index.html#',
  'titanCareIndex': preFix + '/titancare/index.html#',
  'titanMallIndex': preFix + '/titanmall/index.html#',
  'h5MallIndex': preFix + '/mall/index.html#',
  'reportIndex': preFix + '/titan-dailyreport/index.html#',
  'unionIndex': preFix + '/titanunion/index.html#',
  'ihsystemIndex': preFix + '/ihsystem/index.html#',
  'surveyIndex': preFix + '/survey-pc/pc.html#',
  formatDate: function (timestamp) {
    if (!timestamp) {
      return ''
    }
    return moment(timestamp).format('YYYY-MM-DD')
  },
  createObjFromSchema: function (schema) {
    var obj = {}
    let self = this
    for (let field of schema) {
      self.setProp(obj, field.name, '')
      if (field.initValue) obj[field.name] = field.initValue // 非字符串类型值时：给定默认值
      if (field.startName || field.endName) {
        obj[field.startName] = ''
        obj[field.endName] = ''
      }
    }
    return obj
  },
  getFieldFromSchema (schema, name) {
    var arr = schema.filter(field => {
      return field.name === name
    })
    var field = arr.length ? arr[0] : null
    return field
  },
  bindEnter: function (handle) {
    const enterTabToggle = document.querySelector('.enter_tab_toggle')
    let inputDOM = enterTabToggle.querySelectorAll('.el-input__inner, .el-button, textarea, .el-button--primary')
    let next = 0
    inputDOM[0] && inputDOM[0].focus()
    document.onkeydown = function (e) {
      inputDOM = enterTabToggle.querySelectorAll('.el-input__inner, .el-button, textarea, .el-button--primary')
      setTimeout(_ => {
        let keyNum = window.event ? e.keyCode : e.which
        if (keyNum === 13) {
          if (inputDOM && inputDOM.length) {
            inputDOM.forEach((item, index) => {
              if (item === e.target) {
                next = index + 1
              }
            })
          }
          if (next === inputDOM.length) {
            next = 0
          }
          // 判断是否有 messageBox 弹层
          let isFocus = true
          if (handle) isFocus = handle()
          isFocus && inputDOM[next] && inputDOM[next].focus()

          // if (next === inputDOM.length) {
          //   next = 0
          // }
          // if (handle) handle()
          // inputDOM[next] && inputDOM[next].focus()
        }
      }, 100)
    }
  },
  setProp: (obj, path, value) => {
    if (!path) {
      return
    }
    var pList = path.split('.')
    var len = pList.length
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i]
      if (!obj[elem]) obj[elem] = {}
      obj = obj[elem]
    }
    obj[pList[len - 1]] = value
  },
  getProp: (obj, prop) =>
    prop.reduce((xs, x) => {
      if (xs && xs[x] && (typeof xs[x] === 'string')) {
        return xs[x]
      } else {
        return (xs && typeof xs[x] !== 'undefined') ? xs[x] : null
      }
    }, obj),
}

Object.assign(diction, BASECONFIG)

ever.install = function (Vue, options) {
  Vue.prototype.$ever = diction
  Vue.prototype.$messageTips = messageTips
  Vue.prototype.$bus = bus
  Vue.prototype.$formAutofocus = formAutofocus
  Vue.prototype.$host = config
  // 将filters挂载到vue到原型上，在js中可以调用如：this.filters.functionName(...args) 如this.filters.subZeroAndDot(123.0000)
  Vue.prototype.$filters = Vue.options.filters

  Vue.prototype.$hasPermission = function (resource) {
    if (!resource || !resource.length || !$store.state.resources) {
    // if (!resource || !resource.length || !$store.state.resources || ($store.state.resources && $store.state.resources.length === 0)) {
      return true
    }
    let _pos = false
    if (Array.isArray(resource)) {
      for (var str of resource) {
        if ($store.state.resources.indexOf(str) > -1) {
          return true
        }
      }
    } else {
      _pos = $store.state.resources.indexOf(resource) > -1
    }
    // 本地放开权限控制，先显示所有权限，为了方便调试菜单
    // if (window.location.href.indexOf('localhost') > -1) {
    //   _pos = true
    // }
    return _pos
  }
}
export { diction, ever }
export default diction
