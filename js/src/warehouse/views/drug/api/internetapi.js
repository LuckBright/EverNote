/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-20 11:44:06
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-25 12:04:16
 */

/**
 * 互联网商城订单接口api
*/
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'InternetMall/'

// 订单任务列表
function queryList (params) {
  return axios.post(url + 'queryList/', params)
}

// 订单详情
function getOrderDetail (params) {
  return axios.post(url + 'getOrderDetail/', params)
}

// 订单缺货列表
function queryStockoutList (params) {
  return axios.post(url + 'queryStockoutList/', params)
}

// 订单发货记录
function queryCompletedList (params) {
  return axios.post(url + 'queryCompletedList/', params)
}

// 单个订单发货
function singleSend (params) {
  return axios.post(url + 'singleSend/', params)
}

// 批量订单发货
function batchSend (params) {
  return axios.post(url + 'batchSend/', params)
}

// 修改物流信息
function updateLogistics (params) {
  return axios.post(url + 'updateLogistics/', params)
}

export default {
  queryList,
  getOrderDetail,
  queryStockoutList,
  queryCompletedList,
  singleSend,
  batchSend,
  updateLogistics,
}
