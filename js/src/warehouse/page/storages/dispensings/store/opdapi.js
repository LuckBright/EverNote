// 门诊发药api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'outpatientDispense/'
const backStocksUrl = 'backStocks/' // 退药

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
// 退药列表 以患者维度
function getOrderBy (params) {
  return axios.post(backStocksUrl + 'getOrderBy/', params)
}
// 退药详情（门诊）
function getBackStocksList (params) {
  return axios.post(backStocksUrl + 'getBackStocksList/', params)
}

export default {
  getBackStocksVisitSnList,
  getBackStocksOutpatientDispenseList,
  getOrderBy,
  getBackStocksList,
  updateBackStocks
}
