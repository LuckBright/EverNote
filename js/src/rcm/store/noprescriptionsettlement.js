/*
 * @Author: renpengfei
 * @Date: 2018-11-02 11:39:10
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-12-28 10:40:26
 */
import fetch from './api'
import {diction} from '@/store/common'
const url = diction.api
const outpatientUrl = '/rcm/ar/settlement/'
const cashierUrl = '/rcm/cashier/medicalRefund/'
const sobprojectUrl = '/sob/service/'
const accountbillUrl = '/ar/accountbill/'
export const commitTradeStateAll = (data) => {
  return fetch({
    url: url + outpatientUrl + 'commitTradeStateAll',
    method: 'post',
    data: data
  })
}
// 所有项目
export const queryServiceStandard = (data) => {
  return fetch({
    url: url + sobprojectUrl + 'queryService',
    method: 'post',
    data: data
  })
}
// 查询列表
export const getMedicalRefundList = (data) => {
  return fetch({
    url: url + cashierUrl + 'getMedicalRefundList',
    method: 'post',
    data: data
  })
}
export const getMedicalRefundService = (data) => {
  return fetch({
    url: url + cashierUrl + 'getMedicalRefundService',
    method: 'post',
    data: data
  })
}
// 补费列表
export const getMakeupFeeList = (data) => {
  return fetch({
    url: url + '/rcm/ar/repayItem/selectList',
    method: 'post',
    data: data
  })
}
// 项目
export const create = (data) => {
  return fetch({
    url: accountbillUrl + 'createNoOrderSettle',
    method: 'post',
    data: data
  })
}
// 项目
export const deletelist = (data) => {
  return fetch({
    url: url + outpatientUrl + 'delete',
    method: 'post',
    data: data
  })
}
// 项目
export const getDailyDetails = (data) => {
  return fetch({
    url: '/cashier/getDailyDetails',
    method: 'post',
    data: data
  })
}
// 项目
export const getBySettlement = (data) => {
  return fetch({
    url: '/pay/getBySettlement/',
    method: 'post',
    data: data
  })
}
