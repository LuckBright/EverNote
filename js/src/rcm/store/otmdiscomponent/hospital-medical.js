/*
 * @Author: renpengfei
 * @Date: 2018-09-14 18:22:38
 * @Last Modified by: renpengfei
 * @Last Modified time: 2020-09-18 14:11:29
 */
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/ccyb'
const settlementUrl = '/ip/settlement'

export const autoUploadIdCard = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/autoUploadIdCard`,
    method: 'post',
    data: data
  })
}
export const manualUploadIdCard = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/manualUploadIdCard`,
    method: 'post',
    data: data
  })
}
export const verifyIdCard = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/verifyIdCard`,
    method: 'post',
    data: data
  })
}
// 查询医保信息
export const settleList = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/selectSettleDocs`,
    method: 'post',
    data: data
  })
}
// 医保明细上报
export const SettleDtlsUpload = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/selectSettleDtls`,
    method: 'post',
    data: data
  })
}
// 手动预结算
export const preSettle = (data) => {
  return fetch({
    url: `${settlementUrl}/preSettle`,
    method: 'post',
    data: data
  })
}
// 处方重传
export const receiptUploadAgain = (data) => {
  return fetch({
    url: `${settlementUrl}/reReportFeeDetail`,
    method: 'post',
    data: data
  })
}
// 明细撤销
export const cancelFeeDetailReport = (data) => {
  return fetch({
    url: `${settlementUrl}/cancelFeeDetailReport`,
    method: 'post',
    data: data
  })
}
// 撤销登记
export const cancelRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/cancelRegister`,
    method: 'post',
    data: data
  })
}
// 撤销登记
export const selectSettleDtls = (data) => {
  return fetch({
    url: `${url}/insurance/changfeng/selectSettleDtls`,
    method: 'post',
    data: data
  })
}
