// 本文档是吉林省保api的文档
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/jlyb'

// 吉林医保读卡接口
export const getPersonInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getPersonInfo`,
    method: 'post',
    data: data
  })
}
// 住院登记接口
export const jlsbMedicalReg = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/register`,
    method: 'post',
    data: data
  })
}
// 住院医保管理获取列表接口
export const jlsbMedicalList = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getRegisterInfo`,
    method: 'post',
    data: data
  })
}
// 二层上报结算信息
export const medicalSettleList = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/selectSettleDocs`,
    method: 'post',
    data: data
  })
}
// 三层上报结算费用明细
export const medicalSettleDtls = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/selectSettleDtls`,
    method: 'post',
    data: data
  })
}
