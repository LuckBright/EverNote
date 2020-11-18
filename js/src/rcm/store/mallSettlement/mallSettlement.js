/*
 * @Author: renpengfei
 * @Date: 2018-04-23 15:00:50
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-04-24 11:11:20
 */
import fetch from '../api'
const mallUrl = '/mall/close'
/**
 * 商城日结
 *
 * @param {any} data
 * @returns
 */
export const getMallInfo = (data) => {
  return fetch({
    url: mallUrl + '/getClose',
    method: 'post',
    data: data
  })
}
/**
 * 支付方式明细
 *
 * @param {any} data
 * @returns
 */
export const getPaymentInfo = (data) => {
  return fetch({
    url: mallUrl + '/getPaymentInfo',
    method: 'post',
    data: data
  })
}
/**
 * 日结
 *
 * @param {any} data
 * @returns
 */
export const close = (data) => {
  return fetch({
    url: mallUrl,
    method: 'post',
    data: data
  })
}
