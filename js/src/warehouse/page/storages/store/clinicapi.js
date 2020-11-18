// 门诊发药api
import { warehouse as axios } from '@/warehouse/store/api'
import { diction } from '@/store/common'
const url = 'outpatientDispense/'
const skipUrl = 'dispenseSetting/'
const backStocksUrl = 'backStocks/'
const prhurl = diction.api + '/phr/'

// 收方发药
function getByAdviceId (params) {
  return axios.post(url + 'getOutpatientDispenseListByRelationId/', params).then(result => {
    return result
  })
}

// 收方发药
function getByAdviceDispense (params) {
  return axios.post(url + 'getOutpatientDispenseListByDispense/', params).then(result => {
    return result
  })
}

// 重新打印
function repeatDispensePrint (params) {
  return axios.post(url + 'updateRepeatOutpatientDispensePrint/', params).then(result => {
    return result
  })
}

// 发药
function updateDispenseType (obj) {
  return axios.post(url + 'updateOutpatientDispenseType/', obj)
}

// 摆药
function updateDispenseStatus (params) {
  return axios.post(url + 'updateDispenseStatus/', params).then(result => {
    return result
  })
}

// 操作记录
function getLogList (params) {
  return axios.post(url + 'getUpdateOutpatientDispenseLogList/', params).then(result => {
    return result
  })
}

// 患者列表
function getVisitSnList (params) {
  return axios.post(url + 'getVisitSnList/', params).then(result => {
    return result
  })
}

// 根据门诊号获取处方信息
function getDispenseList (params) {
  return axios.post(url + 'getOutpatientDispenseList/', params).then(result => {
    return result
  })
}

// 数据查询
function searchByAdviceDispense (params) {
  return axios.post(url + 'getOutpatientDispenseListByDispenseForSearch/', params).then(result => {
    return result
  })
}

// 获取异常列表
function getDispenseInfo (params) {
  return axios.post(url + 'getOutpatientDispenseInfoByOutpatientDispenseIds/', params).then(result => {
    return result
  })
}

// 异常标记
function updateDispenseIdentification (obj) {
  return axios.post(url + 'updateOutpatientDispenseIdentification/', obj)
}

// 批量摆药 - 摆药单
function getBatchDispenseList (params) {
  return axios.post(url + 'getDispenseList/', params).then(result => {
    return result
  })
}

// 批量摆药 - 摆药详情
function getBatchDispenseInfoList (params) {
  return axios.post(url + 'getDispenseInfoList/', params).then(result => {
    return result
  })
}

// 是否摆药
function getDispenseSetting (params) {
  return axios.post(skipUrl + 'getDispenseSetting/', params).then(result => {
    return result
  })
}

// 门诊退药左侧列表
function getBackStocksVisitSnList (params) {
  return axios.post(url + 'getBackStocksVisitSnList/', params).then(result => {
    return result
  })
}

// 门诊退药右侧列表
function getBackStocksOutpatientDispenseList (params) {
  return axios.post(url + 'getBackStocksOutpatientDispenseList/', params).then(result => {
    return result
  })
}

// 确认退药或拒绝
function updateBackStocks (params) {
  return axios.post(backStocksUrl + 'updateBackStocks/', params)
}
// phr 获取recipeCode
function phrGetByRecipeCode (params) {
  return axios.post(prhurl + 'doctor/doctorRecipe/getByRecipeCode', params)
}

export default {
  getByAdviceId,
  updateDispenseType,
  getLogList,
  getVisitSnList,
  getDispenseList,
  getDispenseInfo,
  updateDispenseIdentification,
  getBatchDispenseList,
  getBatchDispenseInfoList,
  getDispenseSetting,
  getBackStocksVisitSnList,
  getBackStocksOutpatientDispenseList,
  updateBackStocks,
  getByAdviceDispense,
  repeatDispensePrint,
  searchByAdviceDispense,
  updateDispenseStatus,
  phrGetByRecipeCode
}
