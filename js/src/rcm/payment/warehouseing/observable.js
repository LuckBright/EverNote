/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-07 16:07:34
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-07 16:19:03
 * 共享数据 -- 状态管理
 */
import Vue from 'vue'

export const store = Vue.observable({
  paymentMethods: [] // 采付管理中收付款方式 - 可用的支付方式
})

export const mutations = {
  setPaymentMethods (payload) { // 设置支付方式列表
    store.paymentMethods = payload
  }
}
