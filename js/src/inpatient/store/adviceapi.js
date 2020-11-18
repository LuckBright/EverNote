import {inpatient as axios} from './sobapi'
const url = '/sob/'

/**
 * 发送
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function sendAdvice (params) {
  return axios.post(url + 'medicalOrder/sendAdvice', params).then(result => {
    return result
  })
}
/**
 * 撤回
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function cancelAdvice (params) {
  return axios.post(url + 'medicalOrder/removeAdvice', params).then(result => {
    return result
  })
}
/**
 * 停止
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function stopAdvice (params) {
  return axios.post(url + 'medicalOrder/stopAdvice', params).then(result => {
    return result
  })
}

/**
 * 作废
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function invalidAdvice (params) {
  return axios.post(url + 'medicalOrder/invalidAdvice', params).then(result => {
    return result
  })
}
/**
 * 删除
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function deleteAdvice (params) {
  return axios.post(url + 'medicalOrder/deleteAdvice', params).then(result => {
    return result
  })
}

/**
 * 查询医嘱关联收费项
 * @param params
 * @returns {*}
 */
function getServiceOrderItemsByBatchNo (params) {
  return axios.post(url + 'OrderController/getServiceOrderItemsByBatchNo', params)
}

function getTicketCode (params) {
  return axios.post(url + 'tsNumberGenerater/take', params).then(result => {
    return result
  })
}
export default {
  cancelAdvice,
  sendAdvice,
  stopAdvice,
  getTicketCode,
  deleteAdvice,
  getServiceOrderItemsByBatchNo,
  invalidAdvice
}
