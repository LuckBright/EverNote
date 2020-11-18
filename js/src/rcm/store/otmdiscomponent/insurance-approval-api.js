
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/jljhyb'

// 大病、慢病申报列表
export const reportList = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/reportList`,
    method: 'post',
    data: data
  })
}
// 3240.医院门诊大病审批信息上报（读卡）
export const reportSerious = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/reportSerious`,
    method: 'post',
    data: data
  })
}
// 3250.医院门诊慢性病审批信息上报（读卡）
export const reportChronic = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/reportChronic`,
    method: 'post',
    data: data
  })
}
// 获取转院审批列表
export const getTransferList = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getTransferList`,
    method: 'post',
    data: data
  })
}
// 3260.医院转院审批撤消（读卡）
export const cancelTranSfer = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/cancelTranSfer`,
    method: 'post',
    data: data
  })
}
// 3230.医院转院审批信息上报（读卡）
export const tranSfer = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/tranSfer`,
    method: 'post',
    data: data
  })
}
// 获取转院审批详细信息
export const getTransferDetail = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getTransferDetail`,
    method: 'post',
    data: data
  })
}
