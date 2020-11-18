/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-20 15:17:38
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-20 15:21:06
 */

export default {
  testActive ({ commit }, payload) {
    setTimeout(_ => {
      commit('test', payload)
    }, 2000)
  }
}
