/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-29 18:09:56
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-29 18:36:12
 */
import { GET_INSURANE_CENTER_LIST } from './types'

export default {
  [GET_INSURANE_CENTER_LIST] (state, payload) {
    state.list = payload
  }
}
