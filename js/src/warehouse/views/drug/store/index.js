/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-20 15:11:45
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-24 15:23:56
 */

import RegisterMoudle from '@/store/register.module.js'
import mutations from './mouations'
import actions from './actions'
// 注册Vuex模块名称 -- 发药流程
const ModuleName = 'storageRoomProcess'
export default {
  beforeCreate () {
    if (this.$store.state[ModuleName]) return
    RegisterMoudle.install(ModuleName, {
      state: {
        a: 1,
      },
      mutations,
      actions,
      getters: {}
    })
  },
  created () {
    // this.$store.dispatch('testActive', { a: Math.random() })
  },
  beforeDestroy () {
    // RegisterMoudle.uninstall(ModuleName)
  }
}
