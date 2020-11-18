import { workspace as axios } from '@/workspace/store/api'

const doctor = 'c-union/doctor/'

/**
 * 腕带列表
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function list (params) {
  return axios.post(doctor + 'wristbandManage/search', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

/**
 * 腕带创建&更新
 * @param params
 * @returns {*}
 */
function createOrUpdate (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(`${doctor}wristbandManage/${action}`, params)
}

/**
 * 腕带配置创建&更新
 * @param params
 * @returns {*}
 */
function configCreate (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(`${doctor}wristbandConfig/${action}`, params)
}

/**
 * 获取腕带配置
 * @param params
 * @returns {*}
 */
function getConfig (params) {
  return axios.post(`${doctor}wristbandConfig/getByIsNewbornAndVisitType`, params)
}

/**
 * 失效
 * @param params
 * @returns {*}
 */
function lose (params) {
  return axios.post(`${doctor}wristbandManage/updateStatus`, params)
}

/**
 * 更新状态
 * @param params
 * @returns {*}
 */
function updateStatus (params) {
  return axios.post(`${doctor}wristbandManage/modifyStatus`, params)
}

/**
 * 补打
 * @param params
 * @returns {*}
 */
function reprint (params) {
  return axios.post(`${doctor}wristbandManage/patchPrintById`, params)
}

/**
 * 补打患者信息
 * @param params
 * @returns {*}
 */
function patchPrint (params) {
  return axios.post(`${doctor}wristbandManage/patchPrint`, params)
}

export default {
  list,
  createOrUpdate,
  configCreate,
  getConfig,
  lose,
  updateStatus,
  reprint,
  patchPrint
}
