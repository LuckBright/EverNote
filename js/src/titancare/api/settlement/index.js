import { getInstance } from '../api'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()

axios.defaults.baseURL += prefix.cms

// 结算单查询
function getList (params) {
  return axios.post('settlement/getList', params)
}

// 根据结算单ID获取门诊结算单详情信息
function getOutpatientSettlementInfo (params) {
  return axios.post('settlement/getOutpatientSettlementInfo', params)
}

// 获取退费项目明细
function getRefundRecipeItem (params) {
  return axios.post('settlement/getRefundRecipeItem', params)
}

// 获取退费项目明细和用户申请信息
function getRefundRecipeItemAndUser (params) {
  return axios.post('settlement/getRefundRecipeItemAndUser', params)
}

// 退费接口 走warehouse
function refundRecipe (params) {
  return axios.post('settlement/refundRecipe', params.data, params.config)
}

// 强制退费接口 走rcm
function confirmRefund (params) {
  return axios.post('settlement/ar/refund/confirmRefund', params.data, params.config)
}

// 全部拒绝
function refuseBySettlementId (params) {
  return axios.post('refundApply/refuseBySettlementId', params)
}

// 查看退款记录
function getRefundRecords (params) {
  return axios.post('settlement/getRefundRecords', params)
}

// 查看退款记录
function ordersearch (params) {
  return axios.post('/admin/tw/order/search ', params)
}

export default {
  getList,
  getOutpatientSettlementInfo,
  getRefundRecipeItem,
  getRefundRecipeItemAndUser,
  refundRecipe,
  confirmRefund,
  refuseBySettlementId,
  getRefundRecords,
  ordersearch
}
