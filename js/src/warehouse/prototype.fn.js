import { messageTips } from '@/util/common'
const proto = {}
proto.install = function (Vue) {
  function message (type) {
    return function (...args) {
      return messageTips(Vue.prototype, type, ...args)
    }
  }
  Vue.prototype.everWarning = message('warning')
  Vue.prototype.everSuccess = message('success')
  Vue.prototype.everError = message('error')
  Vue.prototype.everInfo = message('info')
}

export default proto
