import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  defaultInsuranceCode (state) {
    var defaultOne = state.list[0] && state.list[0].id || ''
    // 医保管控页面，如果默认的第0个，不在orgList中，页面始终切不出来,现在确保是orgList中有的第一个
    for (let i = 0, len = state.list.length; i < len; i++) {
      if (orgList[state.list[i].id]) {
        defaultOne = state.list[i].id
        break
      }
    }
    return defaultOne
  }
}
