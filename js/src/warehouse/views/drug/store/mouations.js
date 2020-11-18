/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-20 15:07:01
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-20 15:46:15
 */
import { TEST_MUTATION } from './mutation.types'

export default {
  // test muation
  [TEST_MUTATION] (state, payload) {
    state.a = payload.a
  }
}
