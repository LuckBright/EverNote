/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-20 14:39:20
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-27 11:46:12
 */

import store from './index'
export default {
  /**
   * 动态注册Vuex模块
   *
   * @param {String} rawModule  模块名
   * @param {Object} { state = {}, mutations = {}, actions = {}, getters = {} } Vuex 配置项
   */
  install (rawModule, { namespaced = true, state = {}, mutations = {}, actions = {}, getters = {} }) {
    if (!rawModule) return
    store.registerModule(rawModule, {
      namespaced,
      state,
      mutations,
      actions,
      getters
    })
  },
  /**
   * 卸载动态注册Vuex模块
   *
   * @param {String} rawModule 模块名
   */
  uninstall (rawModule) {
    if (!rawModule) return
    store.unregisterModule(rawModule)
  }
}
