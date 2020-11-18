import axios from '@/rcm/store/api'
import axiost from '@/insurance/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/pricemanage/sale/'
const url1 = diction.api + '/pricemanage/trading/'

// 删除价目表
function del (params) {
  return axios.post(url1 + 'price/deleteTradingPrice', params)
}

// 删除价目表中的明细
function delDetails (params) {
  return axios.post(url1 + 'price/deleteTradingPriceDetails', params)
}

// 列表接口
function list (params) {
  return axios.post(url1 + 'price/getTradingPriceList', params)
}

function isEdit (params) {
  return axios.post(url + 'common/checkCurrentOrgPriceTableEditStatus', params).then(result => {
    return result.data
  })
}

function getListByPriceTableIds (params) {
  return axios.post(url + 'dataSynchronizationTask/getListByPriceTableIds', params)
}

// 获取小数点后保留极为小数
function getPricePrecision (params) {
  return axios.post(url + 'common/getPricePrecision', params)
}

function getSelect (params) {
  return axiost.post(url + 'common/getApplicableOrgs', params)
}

// 保存价目表
function priceSave (params) {
  return axiost.post(url1 + 'price/save', params)
}

// 项目列表
function getItemList (params) {
  return axiost.post(url1 + 'price/getItemList', params)
}

// 价目表详情
function getTradingPriceAndDetails (params) {
  return axiost.post(url1 + 'price/getTradingPriceAndDetails', params)
}
export default {
  del,
  list,
  isEdit,
  getListByPriceTableIds,
  getPricePrecision,
  getSelect,
  priceSave,
  delDetails,
  getItemList,
  getTradingPriceAndDetails
}
