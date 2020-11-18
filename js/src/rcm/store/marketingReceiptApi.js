/*
 * @Author: renpengfei
 * @Date: 2018-03-15 10:22:27
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-12-14 17:29:23
 */
import fetch from './api'
import axios from '@/insurance/store/api'
const receiptUrl = '/mall/account/'
const paymentUrl = '/mall/settlement/'
const flowUrl = '/pay/trade/'
const payStatusUrl = 'pay/gateway'
/**
 *获取结算列表
 * @param data
 */
export const getReceiptList = (data) => {
  for (let key in data) {
    if (data[key] === '' || (key === 'direction' && data[key] === 0)) {
      delete data[key]
    }
  }
  return fetch({
    url: receiptUrl + 'getList',
    method: 'post',
    data: data
  })
}
/**
 * 获取账单明细
 * @param {*} data
 */
export const getReceiot = (data) => {
  return fetch({
    url: receiptUrl + 'getListInfo',
    method: 'post',
    data: data
  })
}
/**
 * 支付生成结算单
 * @param {*} data
 */
export const payment = (data) => {
  return fetch({
    url: paymentUrl + 'create',
    method: 'post',
    data: data
  })
}
/**
 * 结算单详情
 * @param {*} data
 */
export const getListInfo = (data) => {
  return fetch({
    url: receiptUrl + 'getListInfo',
    method: 'post',
    data: data
  })
}
/**
 * 支付方式获取
 * @param {*} data 挂号支付 type 1 /liyong/
 */
export const getPayment = (data) => {
  return fetch({
    url: '/pay/payment',
    method: 'post',
    data: data
  })
}
/**
 * 获取支付信息（包扩记录支付列表）
 * @param {*} data
 */
export const getPayList = (data) => {
  return fetch({
    url: paymentUrl + 'getPrint',
    method: 'post',
    data: data
  })
}
/**
 * 创建支付流水
 * @param {*} data
 */
export const createFlow = (data) => {
  return fetch({
    url: flowUrl + 'create',
    method: 'post',
    data: data
  })
}
/**
 * 扫码支付状态
 * @param {*} data
 */
export const getPayStatus = (data) => {
  return fetch({
    url: payStatusUrl,
    method: 'post',
    data: data
  })
}
/**
 * 作废单条流水
 * @param {*} data
 */
export const cancel = (data) => {
  return fetch({
    url: flowUrl + 'cancel',
    method: 'post',
    data: data
  })
}
/**
 * 统一退款接口
 * @param {*} data
 */
export const refund = (data) => {
  return fetch({
    url: flowUrl + 'refund',
    method: 'post',
    data: data
  })
}
/**
 * 统一退款接口
 * @param {*} data
 */
export const mallc = (data) => {
  return fetch({
    url: paymentUrl + 'mallC',
    method: 'post',
    data: data
  })
}

/**
 * 套餐订单更改支付状态
 * @param {*} data
 */
export const changeStatusAtMarketCenter = (params) => {
  return axios.post('/market/doctor/setmealOrder/changeStatusAtMarketCenter', params)
}
