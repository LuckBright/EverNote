/**
 * 门诊患者医嘱执行单
 */
import {api as axios} from '../api'
const url = 'sob/RecipeExcuteController/'

/**
 * 获取门诊医嘱执行患者列表
 * @param params
 * @returns {*}
 */
function findPatientList (params) {
  return axios.post(url + 'findPatientList', params)
}

/**
 * 获取患者医嘱
 * @param params
 * @returns {*}
 */
function findRecipeExcuteRecordByPatientId (params) {
  return axios.post(url + 'findRecipeExcuteRecordByPatientId', params)
}

/**
 * 根据处方id查询执行单信息
 * @param params
 * @returns {*}
 */
function findRecipeExcuteRecordByRecipeId (params) {
  return axios.post(url + 'findRecipeExcuteRecordByRecipeId', params)
}

/**
 * 根据处方id查询执行单计划详细信息
 * @param params
 * @returns {*}
 */
function getRecipeExcuteDetailList (params) {
  return axios.post(url + 'getRecipeExcuteDetailList', params)
}

/**
 * 根据执行单id更新预计执行时间
 * @param params
 * @returns {*}
 */
function updateRecipeExcuteById (params) {
  return axios.post(url + 'updateRecipeExcuteById', params)
}

/**
 * 领药确认
 * @param params
 * @returns {*}
 */
function excuteOrder (params) {
  return axios.post('sob/OrderController/excuteOrder', params)
}

/**
 * 保存操作日志信息
 * @param params
 * @returns {*}
 */
function createTaskLog (params) {
  return axios.post('sob/taskLog/createTaskLog', params)
}

function querySkinTestResult (params) {
  return axios.post('/sob/inpatientController/querySkinTestResult', params)
}

// 查询当前医生患者队列
function getQueueContentBytimeFrame (params) {
  return axios.post('/thc-queue/queueContent/getQueueContentBytimeFrame', params)
}

// 门急诊护士取消执行
function updateRecipeStatusCancle (params) {
  return axios.post('/sob/RecipeExcuteController/updateRecipeStatusCancle', params)
}

// 门急诊护士转院外执行
function turnExcuteExternalHospital (params) {
  return axios.post('/sob/RecipeExcuteController/turnExcuteExternalHospital', params)
}

export default {
  getQueueContentBytimeFrame,
  findPatientList,
  findRecipeExcuteRecordByPatientId,
  findRecipeExcuteRecordByRecipeId,
  getRecipeExcuteDetailList,
  updateRecipeExcuteById,
  excuteOrder,
  createTaskLog,
  querySkinTestResult,
  updateRecipeStatusCancle,
  turnExcuteExternalHospital
}
