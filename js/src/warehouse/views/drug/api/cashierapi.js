/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-18 10:54:41
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-18 16:32:39
 */
/**
 * 超时收银API
*/
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'cashier/'

/**
 * 发货任务列表
 *
 * @param {*} params
 * @returns
 */
function list (params) {
  return axios.post(url + 'getCashierTaskDtoList', params)
}

/**
 * 发货任务明细
 *
 * @param {number | string} sourceCode    订单code

 * @returns
 */
function getTaskItem (sourceCode) {
  return axios.post(url + 'getCashierTaskItemByCode', { sourceCode })
}

/**
 * 退货任务列表
 *
 * @param {*} params
 * @returns
 */
function getBackList (params) {
  return axios.post(url + 'getBackTaskListBySourceCode', params)
}

/**
 * 退货任务明细
 *
 * @param {*} code
 * @returns
 */
function getBackTaskItem (code) {
  return axios.post(url + 'getCashierBackTaskItemByCode', { code })
}
export default {
  list,
  getTaskItem,
  getBackList,
  getBackTaskItem,
}
