// 本文档是黑龙江医保api的文档
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/sysqyb'
const rcmHosUrl = '/rcm/ip/settlement'

// 2100读卡接口
export const getPersonInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getPersonInfo`,
    method: 'post',
    data
  })
}
// 参保人员基本信息及其医保个人帐户查询(1400)
export const queryPersonInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryPersonInfo`,
    method: 'post',
    data
  })
}
// 住院登记2210
export const medicalRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/register`,
    method: 'post',
    data
  })
}

// 登记修改
export const updateRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/updateRegister`,
    method: 'post',
    data
  })
}

// 医保出院登记
export const outRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/outRegister`,
    method: 'post',
    data
  })
}

// 身份撤销
export const cancelRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/cancelRegister`,
    method: 'post',
    data
  })
}

// 诊断信息维护(2231)
export const updateDiagnosis = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/updateDiagnosis`,
    method: 'post',
    data
  })
}
// 诊断信息维护(2231)
export const cancelDiagnosis = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/cancelDiagnosis`,
    method: 'post',
    data
  })
}
// 1200 医疗费用明细查询
export const medicalExpensesDetailQuery = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/medicalExpensesDetailQuery`,
    method: 'post',
    data
  })
}
// 7910 城乡居民结算单查询
export const residentsSettlementQuery = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/residentsSettlementQuery`,
    method: 'post',
    data
  })
}
// 就诊结算ID查询
export const settlementIdQuery = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/settlementIdQuery`,
    method: 'post',
    data
  })
}

// 住院医保管理第二层获取处方信息
export const getPreSettlement = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getPreSettlement`,
    method: 'post',
    data
  })
}

// 住院医保管理获取第三层处方明细
export const getSettlementItems = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/getSettlementItems`,
    method: 'post',
    data
  })
}
// 三亚世侨修改登记信息弹窗--获取登记信息
export const getMedicalRegisterInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/regextend`,
    method: 'post',
    data
  })
}
// 三亚目录对照，获取状态为“上传中”的对照，并更新最新审核结果
export const updateUploadingStatus = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/updateUploadingStatus`,
    method: 'post',
    data
  })
}
// 三亚处方重传，增加轮询查询接口
export const getSysqReReportStatus = (data) => {
  return fetch({
    url: `${url}${rcmHosUrl}/getSysqReReportStatus`,
    method: 'post',
    data
  })
}
