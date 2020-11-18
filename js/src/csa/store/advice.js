import { arrange as axios } from './api'

// 提交医嘱
function submitDoctorAdvices (params) {
  return axios.post('/sob/operation/submitDoctorAdvices', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}

// 撤回医嘱
function removeDoctorAdviceByIds (params) {
  return axios.post('/sob/operation/removeDoctorAdviceByIds', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}

// 取消医嘱
function cancelDoctorAdviceByIds (params) {
  return axios.post('/sob/operation/cancelDoctorAdviceByIds', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}

// 查询已提交医嘱列表
function queryDoctorAdvice (params) {
  return axios.post('/sob/operation/queryDoctorAdvice', params).then(res => {
    return res.data || []
  }).catch(() => {
    return []
  })
}

// 手术执行单查询
function getOperationExecuteList (params) {
  return axios.post('/sob/outpatientExecute/getOperationExecuteList', params).then(res => {
    return res.data || []
  }).catch(() => {
    return []
  })
}

// 手术执行单更新
function updateOperationExecute (params) {
  return axios.post('/sob/outpatientExecute/updateOperationExecute', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}

// 手术退库申请
function operationExecuteReturnMaterials (params) {
  return axios.post('/sob/outpatientExecute/operationExecuteReturnMaterials', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}

// 手术坚持发药
function operationExecuteConfirmMaterials (params) {
  return axios.post('/sob/outpatientExecute/operationExecuteConfirmMaterials', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}

export default {
  submitDoctorAdvices,
  removeDoctorAdviceByIds,
  cancelDoctorAdviceByIds,
  queryDoctorAdvice,
  getOperationExecuteList,
  updateOperationExecute,
  operationExecuteReturnMaterials,
  operationExecuteConfirmMaterials
}
