// 本文档是黑龙江医保api的文档
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/hljyb'

// 黑龙江医保修改密码接口
export const changePassWord = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/changePassWord`,
    method: 'post',
    data: data
  })
}
// 黑龙江医保门诊读卡接口
export const hljGetPersonInfoMz = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/readCard`,
    method: 'post',
    data: data
  })
}

// 黑龙江医保挂号读卡接口
export const hljGetPersonInfoGh = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/registerReadCard`,
    method: 'post',
    data: data
  })
}

// 门诊特慢病查询接口
export function specialDisQuery (data) {
  return fetch({
    url: `${url}${medicalUrl}/specialRegisterQuery`,
    method: 'post',
    data: data
  })
}
// 门诊读卡分解
export const hljmedicalSettle = (data) => {
  return fetch({
    url: `/medical/medicalSettle`,
    method: 'post',
    data: data
  })
}
// 黑龙江医保预警管理----查询接口
export const prewarnList = (data) => {
  return fetch({
    url: `/medical/queryWarning`,
    method: 'post',
    data: data
  })
}
// 黑龙江医保预警管理----登记查询
export const prewarnReg = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/outpatientWarningRegisterQuery`,
    method: 'post',
    data: data
  })
}
// 黑龙江医保预警管理----预警明细查询
export const prewarnDetail = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/outpatientWarningDetailQuery`,
    method: 'post',
    data: data
  })
}
// 黑龙江医保预警管理----预警审批
export const prewarnApproval = (data) => {
  return fetch({
    url: `/medical/warningApproval`,
    method: 'post',
    data: data
  })
}

// 黑龙江医保预警管理----预警审批删除
export const prewarnDelete = (data) => {
  return fetch({
    url: `/medical/deleteWarning`,
    method: 'post',
    data: data
  })
}

// 黑龙江医保预警管理----门诊累计消费明细
// /insurance/hljyb / outpatDeparCumConsume
export const prewarnConsume = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/outpatDeparCumConsume`,
    method: 'post',
    data: data
  })
}

// SP0220 获取定点机构配置参数信息
export const getDesignnatedOrgConfigParams = params => {
  return fetch.post(`${url + medicalUrl}/getDesignnatedOrgConfigParams/`, params)
}

// SP0222 获取定点机构对应的经办机构信息
export const getDesignnatedOrgHandelOrgInfo = params => {
  return fetch.post(`${url + medicalUrl}/getDesignnatedOrgHandelOrgInfo/`, params)
}

// SP0612 医疗费用年申报信息
export const medicalCostYearReport = params => {
  return fetch.post(`${url + medicalUrl}/medicalCostYearReport/`, params)
}

// SP0605 基本医疗年度对帐表(S)
export const medicalCostYear = params => {
  return fetch.post(`${url + medicalUrl}/medicalCostYear/`, params)
}

// SP0633 省内异地就医费用年结算对账表（年度）(SD)
export const medicalCostMouthDifPlacesSettlement = params => {
  return fetch.post(`${url + medicalUrl}/medicalCostMouthDifPlacesSettlement/`, params)
}
// SP0626 拒付明细信息查询
export const medicalCostRefusePay = params => {
  return fetch.post(`${url + medicalUrl}/medicalCostRefusePay/`, params)
}

// SP0627 异地医疗费用月申报信息
export const medicalCostMouthDifPlaces = params => {
  return fetch.post(`${url + medicalUrl}/medicalCostMouthDifPlaces/`, params)
}

// SP0632 省内异地就医费用预结算表(SD)
export const medicalCostMouthDifPlacesPreSettlement = params => {
  return fetch.post(`${url + medicalUrl}/medicalCostMouthDifPlacesPreSettlement/`, params)
}

// SP0513 黑龙江医保：目录新增：上传
export const specialDetailInfoUpload = params => {
  return fetch.post(`${url + medicalUrl}/specialDetailInfo/`, params)
}

// SP0514 复制中心目录批量新增本地目录 (新增)
export const copyCenterThreeCatalogeus = params => {
  return fetch.post(`${url + medicalUrl}/copyCenterThreeCatalogeus/`, params)
}

// SP0630 省内异地就医发生费用参保地机构信息(SD)
export const medicalCostMouthDifPlacesOrg = params => {
  return fetch.post(`${url + medicalUrl}/medicalCostMouthDifPlacesOrg/`, params)
}

// 个人账户查询
export const selfAccountQuery = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/personalAccountQuery`,
    method: 'post',
    data: data
  })
}
// 黑龙江预警预分解
export const warningPreSettle = (data) => {
  return fetch({
    url: `/medical/warningPreSettle`,
    method: 'post',
    data: data
  })
}
// 黑龙江特殊疾病上次就诊信息查询
export const specialDisLastQuery = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/specialDisLastQuery`,
    method: 'post',
    data: data
  })
}
// 黑龙江省直查询费用申报信息
export const medicalFeeDecalaration = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/medicalCostMouth`,
    method: 'post',
    data: data
  })
}
// SP2218 定点协议签署情况
export const hospitalProtocolInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/hospitalProtocolInfo`,
    method: 'post',
    data: data
  })
}
// SP2214 法人注册
export const legalPersonRegister = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/legalPersonRegister`,
    method: 'post',
    data: data
  })
}
// SP2217 医院协议签署
export const hospitalProtocolSign = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/hospitalProtocolSign`,
    method: 'post',
    data: data
  })
}
// SP2216 法人注册查询
export const legalPersonQuery = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/legalPersonQuery`,
    method: 'post',
    data: data
  })
}
