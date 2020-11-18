/*
 * @Author: renpengfei
 * @Date: 2018-04-02 16:27:02
 * @Last Modified by: renpengfei
 * @Last Modified time: 2019-01-15 16:42:00
 */
import fetch from '../api'
const clearingUrl = '/ip/settlement/'
const flowUrl = '/pay/trade/'
const patientUrl = '/c-union/doctor/patient/'
const codeUrl = '/common/param/'
// const paintUrl = '/ip/accountbill/'
// const paymentUrl = '/mall/settlement/'
// const payStatusUrl = 'pay/gateway'
// const accountbillUrl = '/ip/accountbill/'
// const settlementUrl = '/ip/settlement/'
// const exportUrl = '/insurance/hospitalExpenses/'
// const biUrl = '/BI/bIController'
// const feeUrl = '/cashier/parameter'
import { diction } from '@/store/common'
const url = diction.api
// /**
//  * 获取住院账单列表
//  *
//  * @param {any} data
//  * @returns
//  */
// export const getPatientList = (data) => {
//   for (let key in data) {
//     if (data[key] === '' || (key === 'direction' && data[key] === 0)) {
//       delete data[key]
//     }
//   }
//   return fetch({
//     url: paintUrl + 'getPatientList',
//     method: 'post',
//     data: data
//   })
// }
/**
 * 获取住院结算单 use
 *
 * @param {any} data
 * @returns
 */
export const getIpSettlement = (data) => {
  return fetch({
    url: clearingUrl + 'getIpSettlement',
    method: 'post',
    data: data
  })
}
// /**
//  * 获取住院信息（未生成结算单）
//  *
//  * @param {any} data
//  * @returns
//  */
// export const getAccountBillsByPatient = (data) => {
//   return fetch({
//     url: accountbillUrl + 'getAccountBillsByPatient',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 押金查询
//  *
//  * @param {any} data
//  * @returns
//  */
// export const getDepositHistory = (data) => {
//   return fetch({
//     url: settlementUrl + 'getDepositHistory',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 获取支付信息（包扩记录支付列表）
//  * @param {*} data
//  */
// export const getPayList = (data) => {
//   return fetch({
//     url: paymentUrl + 'getPrint',
//     method: 'post',
//     data: data
//   })
// }
/**
   * 创建支付流水 use
   * @param {*} data
   */
export const createFlow = (data) => {
  return fetch({
    url: flowUrl + 'create',
    method: 'post',
    data: data,
    isfilter: true
  })
}
// /**
//    * 扫码支付状态
//    * @param {*} data
//    */
// export const getPayStatus = (data) => {
//   return fetch({ url: payStatusUrl, method: 'post', data: data })
// }
/**
   * 作废单条流水 use
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
 * 支付方式获取 use
 * @param {*} data
 */
export const getPayment = (data) => {
  return fetch({ url: '/pay/payment', method: 'post', data: data })
}
// /**
//  * 押金查询
//  *
//  * @param {any} data
//  * @returns
//  */
// export const createIpSettlement = (data) => {
//   return fetch({
//     url: settlementUrl + 'createIpSettlement',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 押金查询
//  *
//  * @param {any} data
//  * @returns
//  */
// export const update = (data) => {
//   return fetch({
//     url: settlementUrl + 'update',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 获取费用清单
//  *
//  * @param {any} data
//  * @returns
//  */
// export const feeDetails = (data) => {
//   return fetch({
//     url: accountbillUrl + 'feeDetails',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 删除结算单
//  *
//  * @param {any} data
//  * @returns
//  */
// export const deleteSettle = (data) => {
//   return fetch({
//     url: settlementUrl + 'deleteSettle',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 费用分组信息
//  *
//  * @param {any} data
//  * @returns
//  */
// export const getFeeClass = (data) => {
//   return fetch({
//     url: accountbillUrl + 'getFeeClass',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 统一退款接口
//  * @param {*} data
//  */
// export const refund = (data) => {
//   return fetch({
//     url: flowUrl + 'refund',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 统一支付接口
//  * @param {*} data
//  */
// export const surePay = (data) => {
//   return fetch({
//     url: settlementUrl + 'pay',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 更新押金
//  * @param {*} data
//  */
// export const addSettleDetail = (data) => {
//   return fetch({
//     url: settlementUrl + 'addSettleDetail',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 医保导入
//  * @param {*} data
//  */
// export const importInsurance = (data) => {
//   return fetch({
//     url: url + exportUrl + 'import',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 导出结算单
//  * @param {*} data
//  */
// export const exportSettlement = (data) => {
//   return fetch({
//     url: url + exportUrl + 'export',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 上传状态
//  * @param {*} data
//  */
// export const updateIpSettlementByIpNo = (data) => {
//   return fetch({
//     url: clearingUrl + 'updateIpSettlementByIpNo',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 帆软地址
//  * @param {*} data
//  */
// export const selectUrlMapping = (data) => {
//   return fetch({
//     url: url + biUrl + '/selectUrlMapping',
//     method: 'post',
//     data: data
//   })
// }
// /**
//  * 抹零规则
//  * @param {*} data
//  */
// export const roundingFee = (data) => {
//   return fetch({
//     url: feeUrl + '/getRoundingFee',
//     method: 'post',
//     data: data
//   })
// }
/**
 * 患者信息查询 use
 * @param {*} data
 */
export const searchFuzzy = (data) => {
  return fetch({
    url: url + patientUrl + 'searchFuzzy',
    method: 'get',
    params: data
  })
}
/**
 * 根据code查询参数值 use
 * @param {*} data
 */
export const getValueByCode = (data) => {
  return fetch({
    url: codeUrl + 'getValueByCode',
    method: 'post',
    data: data
  })
}
