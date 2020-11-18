
import {
  workspace as axios
} from './api'
const market = 'market/doctor/setmealOrder/'
/**
 * 获取患者套餐列表
 * @param {*} params
 * @returns
 */
function selectNoPayAndNoFinish (params) {
  return axios.post(market + 'selectNoPayAndNoFinish', params)
}
/**
 * 更新订单明细已完成数量
 * @param {*} params
 * @returns
 */
function updateDetail (params) {
  return axios.post(market + 'updateDetail', params)
}
/**
 * 批量更新订单明细已完成数量
 * @param {*} params
 * @returns
 */
function updateDetailBatch (params) {
  return axios.post(market + 'updateDetailBatch', params)
}
/**
 * 根据患者ID获取套餐订单
 * @param {*} params
 * @returns
 */
function selectOrderByPatient (params) {
  return axios.post(market + 'selectOrderByPatient', params)
}
/**
 * 根据订单id\套餐id查询订单详细信息
 * @param {*} params
 * @returns
 */
function getOrderBySetMealId (params) {
  return axios.post(market + 'getOrderBySetMealId', params)
}

// 查询患者产房套餐信息(cpoe)
function getDeliveryRoomMeal (params) {
  return axios.post(market + '/CJ/findPreUse', params)
}

function savePreUse (params) {
  return axios.post(market + '/CJ/savePreUse', params)
}

export default {
  selectNoPayAndNoFinish,
  updateDetail,
  updateDetailBatch,
  selectOrderByPatient,
  getOrderBySetMealId,
  getDeliveryRoomMeal,
  savePreUse
}
