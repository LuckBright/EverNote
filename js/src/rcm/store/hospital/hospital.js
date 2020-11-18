/*
 * @Author: renpengfei
 * @Date: 2018-09-14 18:22:38
 * @Last Modified by: renpengfei
 * @Last Modified time: 2020-11-03 16:28:48
 */
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const hospitalUrl = '/ip/accountbill/'
const settleUrl = '/ip/settlement/'
const refundUrl = '/ip/refund/'
const codeUrl = '/common/param/'
const adtUrl = '/adt/doctor/'
const medicalUrl = '/insurance/ccyb'

/* 结算单查询费用合计 */
export const searchSumSettleFee = (data) => {
  return fetch({
    url: `${settleUrl}/searchSumSettleFee`,
    method: 'post',
    data: data
  })
}

/* 检查是否可以召回 */
export const checkCallback = (data) => {
  return fetch({
    url: `${url}/adt/doctor/out/getById`,
    method: 'post',
    data: data
  })
}

/**
*  患者信息
* @param {*} data
* @returns
*/
export const getPatientInfo = (data) => {
  return fetch({
    data: data,
    method: 'post',
    url: `${hospitalUrl}getPatientInfo`
  })
}
/**
*  费用明细
* @param {*} data
* @returns
*/
export const getFeeDetails = (data) => {
  return fetch({
    data: data,
    method: 'post',
    url: `${hospitalUrl}getFeeDetails`
  })
}
/**
*  类别汇总
* @param {*} data
* @returns
*/
export const getFeeClassByIpNo = (data) => {
  return fetch({
    data: data,
    method: 'post',
    url: `${hospitalUrl}getFeeClassByIpNo`
  })
}
/**
 * 结算记录
 * @param {*} data
 */
export const getSettleHistory = (data) => {
  return fetch({
    url: `${settleUrl}getSettleHistory`,
    method: 'post',
    data: data
  })
}
// 中途结算
export const halfSettle = (data) => {
  return fetch({
    url: `${settleUrl}halfWayIpSettlement`,
    method: 'post',
    data: data
  })
}
// 删除中途结算
export const deleteHalfSettle = (data) => {
  return fetch({
    url: `${settleUrl}cancelHalfWaySettle`,
    method: 'post',
    data: data
  })
}
/**
 * 结算
 * @param {*} data
 */
export const createIpsettlement = (data) => {
  return fetch({
    url: `${settleUrl}createIpSettlement`,
    method: 'post',
    data: data
  })
}
/**
 * 删除结算单
 * @param {*} data
 */
export const deleteSettle = (data) => {
  return fetch({
    url: `${settleUrl}deleteSettle`,
    method: 'post',
    data: data
  })
}
/**
 * 获取结算单
 * @param {*} data
 */
export const getIpsettlement = (data) => {
  return fetch({
    url: `${settleUrl}getIpSettlement`,
    method: 'post',
    data: data
  })
}
/**
 * 押金记录
 * @param {*} data
 */
export const getDepositHistory = (data) => {
  return fetch({
    url: `${settleUrl}getDepositHistory`,
    method: 'post',
    data: data
  })
}
/**
 * 补交押金
 * @param {*} data
 */
export const payDepositInBack = (data) => {
  return fetch({
    url: `${hospitalUrl}payDepositInBack`,
    method: 'post',
    data: data
  })
}
/**
 * 退科
 * @param {*} data
 */
export const backToDept = (data) => {
  return fetch({
    url: `${hospitalUrl}backToDept`,
    method: 'post',
    data: data
  })
}
/**
 * 住院收费
 * @param {*} data
 */
export const hospitalpay = (data) => {
  return fetch({
    url: `${settleUrl}pay`,
    method: 'post',
    data: data
  })
}
/**
 * 退院登记
 * @param {*} data
 */
export const quitFromHospital = (data) => {
  return fetch({
    url: `${url}/adt/doctor/admit/setStatusByHospitalizedNumber`,
    method: 'post',
    data: data
  })
}
/**
 * 召回记录
 * @param {*} data
 */
export const getRecallHistory = (data) => {
  return fetch({
    url: `${settleUrl}getRecallHistory`,
    method: 'post',
    data: data
  })
}
/**
 * 查询召回信息
 * @param {*} data
 */
export const getRecalledInfo = (data) => {
  return fetch({
    url: `${settleUrl}getRecalledInfo`,
    method: 'post',
    data: data
  })
}
/**
 * 查询中途结算信息
 * @param {*} data
 */
export const getHalfSettleInfo = (data) => {
  return fetch({
    url: `${settleUrl}getSettlementInfo`,
    method: 'post',
    data: data
  })
}
/**
 * 召回
 * @param {*} data
 */
export const recall = (data) => {
  return fetch({
    url: `${refundUrl}recall`,
    method: 'post',
    data: data
  })
}
/**
 * 机构科室列表
 * @param {*} data
 */
export const getLocalSectionVoListForService = (data) => {
  return fetch({
    url: `${url}/warehouse/localSectionRecord/getLocalSectionVoListForService/`,
    method: 'post',
    data: data
  })
}
/**
 * 患者列表
 * @param {*} data
 */
export const getPatientList = (data) => {
  return fetch({
    url: `${url}/${adtUrl}admit/admitQueryList`,
    method: 'post',
    data: data
  })
}

// 获取费用性质下拉列表
export const getChargeLevels = (data) => {
  return fetch({
    url: `${hospitalUrl}getChargeLevels`,
    method: 'post',
    data: data
  })
}
// 根据住院号跟新账单明细折扣
export const updateDetailDisount = (data) => {
  return fetch({
    url: `${hospitalUrl}updateDetailDisount`,
    method: 'post',
    data: data
  })
}

/** 押金退款--原路退款 */
export const refundOriginalRoad = (data) => {
  return fetch({
    url: `ip/refund/refundOriginalRoad`,
    method: 'post',
    data: data
  })
}
/** 押金退款--自定义退款 */
export const refundPay = (data) => {
  return fetch({
    url: `ip/refund/refundPay`,
    method: 'post',
    data: data
  })
}
/** 获取患者产房套餐信息(结算界面) */
export const patientDeliveryPlanSettlementInfo = (data) => {
  return fetch({ url: `${url}/market/doctor/setmealOrder/CJ/queryPreUse/`, method: 'post', data })
}

/** 产房套餐结算 */
export const deliveryRoomSettlement = (data) => {
  return fetch({ url: `/ip/settlement/setMealSettlement`, method: 'post', data })
}

/** 产房套餐修改结算状态 */
export const deliveryRoomPackageChangeSettleStatus = (data) => {
  return fetch({ url: `${url}/market/doctor/setmealOrder/changeSettleStatus`, method: 'post', data })
}
/**
 * 根据code查询参数值
 * @param {*} data
 */
export const getValueByCode = (data) => {
  return fetch({
    url: codeUrl + 'getValueByCode',
    method: 'post',
    data: data
  })
}

/**
 * 从自费切回医保时，需要调接口将账单数据恢复100%
 * @param {*} data
 */
export const updateDiscount = (data) => {
  return fetch({
    url: hospitalUrl + 'updateDiscount',
    method: 'post',
    data: data
  })
}
/**
 * 发票打印时获取结算单发票打印的状态
 * @param {*} data
 */
export const getPrintStatus = (data) => {
  return fetch({
    url: settleUrl + 'getPrintControlInfoById',
    method: 'post',
    data: data
  })
}
// 更新结算单状态
export const updateSettleStatus = (data) => {
  return fetch({
    url: settleUrl + 'upateStatus',
    method: 'post',
    data: data
  })
}

// 获取医保信息
export const getMedicalRegisterInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getRegisterInfo`,
    method: 'post',
    data: data
  })
}
// 医保出院登记
export const medicalRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/register`,
    method: 'post',
    data: data
  })
}
// 住院医保结算
export const medicalSettle = (data) => {
  return fetch({
    url: `${settleUrl}insuranceSettle`,
    method: 'post',
    data: data
  })
}
// 住院结算时，想要原路退款，首先拿到原结算单的支付方式信息
export const getDepositHistoryGroup = (data) => {
  return fetch({
    url: `${settleUrl}getDepositHistoryGroup`,
    method: 'post',
    data: data
  })
}
// 住院结算单查询
export const searchSettleInfo = (data) => {
  return fetch({
    url: `${settleUrl}searchSettleInfo`,
    method: 'post',
    data: data
  })
}

