/*
  库房 流程配置 获取
*/
const state = {
  storageroomConfigList: {},
  thisStorageroomProcessConfig: {},
  storageroomSystemConfig: {},
  moreStorageroomList: [],
  thisStorageroomProcessIdList: []
}
const mutations = {
  setStotageroomConfigList (state, value) { // 当前库房所有流程list
    state.storageroomConfigList = value
  },
  setThisStorageroomProcessConfig (state, value) { // 当前库房 当前流程配置
    state.thisStorageroomProcessConfig = value
  },
  setThisStorageroomProcessIdList (state, value) { // 当前库房 当前流程配置
    state.thisStorageroomProcessIdList = value
  },
  setStorageroomSystemConfig (state, value) { // 当前机构库房系统配置
    state.storageroomSystemConfig = value
  },
  setMoreStorageroomList (state, value) { // 获取多库房设置的库房列表
    state.moreStorageroomList = value
  },
}
const actions = {

}
export default {
  state,
  mutations,
  actions
}
