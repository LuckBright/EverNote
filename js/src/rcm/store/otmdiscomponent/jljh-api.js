// 本文档是吉林省保api的文档
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/jljhyb'
const rcmHosUrl = '/rcm/ip/settlement'
const ccybUrl = '/insurance/ccyb'

// 吉林医保读卡接口
export const getPersonInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getPersonInfo`,
    method: 'post',
    data: data
  })
}

// 住院登记、修改、出院、无费退院统一接口，后端区分
export const medicalRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/register`,
    method: 'post',
    data: data
  })
}
// 住院医保管理中处方删除
export const receiptRetrate = (data) => {
  return fetch({
    url: `${url}${rcmHosUrl}/cancelAllFeeDetail`,
    method: 'post',
    data: data
  })
}

// 医保对账的报表8100
export const querySettleInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryClinicSettlement`,
    method: 'post',
    data: data
  })
}
// 8200住院报表查询不考虑撤销或者冲正
export const queryHosInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryHospitalSettement`,
    method: 'post',
    data: data
  })
}
// 8400
export const queryAll = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/allSettlement`,
    method: 'post',
    data: data
  })
}
// 8500
export const querySettlementDetial = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/settlementDetial`,
    method: 'post',
    data: data
  })
}
// 8300查询患者在院信息
export const queryHospitalSettement = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/hospitalNotSettlement`,
    method: 'post',
    data: data
  })
}
// 4100个人封锁及审批信息查询
export const blockAdeInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/blockAdeInfo`,
    method: 'post',
    data: data
  })
}

// 4110审批信息查询
export const chronicBig = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/chronicBig`,
    method: 'post',
    data: data
  })
}
// 4200查患者身份
export const jilinHg = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/jilinHg`,
    method: 'post',
    data: data
  })
}
// 蛟河住院管理三层数据费用明细
// 医保明细上报
export const SettleDtlsUpload = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/selectSettleDtls`,
    method: 'post',
    data: data
  })
}
// 吉林蛟河处方重传，有大量数据时，要轮询处方重传状态
export const getJhReReportStatus = (data) => {
  return fetch({
    url: `${url}${rcmHosUrl}/getJhReReportStatus`,
    method: 'post',
    data: data
  })
}
// 蛟河删除无效登记记录
export const deleteReg = (data) => {
  return fetch({
    url: `${url}${ccybUrl}/deleteReg`,
    method: 'post',
    data: data
  })
}
// 蛟河删除结算信息
export const deleteSettleInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/cancelSettlement`,
    method: 'post',
    data: data
  })
}

