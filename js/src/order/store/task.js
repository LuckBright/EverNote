/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:47:57
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-20 16:09:17
 */
import { warehouse as axios } from '@/warehouse/store/api'
const taskUrl = 'summaryTask/'
const supplierUrl = 'thirdSupplier/'

// 发退药任务列表
function list (params) {
  return axios.post(taskUrl + 'getSummaryTaskDtoList/', params)
}

// 发退药明细
function getSummaryTaskItem (params) {
  return axios.post(taskUrl + 'getSummaryTaskItemByCode/', params)
}

// 机构第三方供应商简称
/**
 * name    按名称模糊查询
 * status  按状态查询
 * {}      查全部
 */
function getOrgThridSupplier (params) {
  return axios.post(supplierUrl + 'getOrgThridSupplier/', params)
}

/**
 * 手动推送订单给第三方(只有推送失败的订单数据才能发起)
 *
 * @param {Array} params taskIds
 * @returns
 */
function createPushMessageByOwn (params) {
  return axios.post(taskUrl + 'createPushMessageByOwn/', params)
}

export default {
  list,
  getOrgThridSupplier,
  getSummaryTaskItem,
  createPushMessageByOwn
}
