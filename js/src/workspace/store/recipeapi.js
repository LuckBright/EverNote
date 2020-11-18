import {workspace as axios} from './api'
const url = '/sob/'

// 查询待提交区处方列表
function getDoctorAdviceInfo (params) {
  return axios.post(url + 'doctorAdviceController/getDoctorAdviceInfo', params)
}

// 查询待提交区处方列表分页
function getDoctorAdviceInfoForPage (params) {
  return axios.post(url + 'doctorAdviceController/getDoctorAdviceForPage', params)
}

// 保存待提交处方
function createDoctorAdvice (params) {
  return axios.post(url + 'doctorAdviceController/createDoctorAdvice', params)
}

// 编辑后保存待提交处方
function updateDoctorAdviceForEdit (params) {
  return axios.post(url + 'doctorAdviceController/updateDoctorAdviceForEdit', params)
}

// 医嘱草稿更新接口（1、合并父子医嘱；2、取消合并的父子医嘱；3、医嘱排序/医嘱删除）
function updateDoctorAdvice (params) {
  return axios.post(url + 'doctorAdviceController/updateDoctorAdvice', params)
}

// 查询已提交区处方列表
function getRecipeByVisitNumber (params) {
  return axios.post(url + 'recipe/getRecipeByVisitNumber', params)
}

// 从待提交区提交处方
function submitRecipeAdvice (params) {
  return axios.post(url + 'recipe/submit', params)
}

// 已提交区处方撤回
function removeRecipeAdvice (params) {
  return axios.post(url + 'recipe/removeByAdviceIds', params)
}

// 已提交区处方取消
function cancelRecipeAdvice (params) {
  return axios.post(url + 'recipe/cancelByAdviceIds', params)
}

// 已提交区查看处方执行记录
function getExecuteRecordsByAdviceIds (params) {
  return axios.post(url + 'recipe/getExecuteRecordsByAdviceIds', params)
}

// 获取频次列表
function getUsefreqList (params) {
  return axios.post('/thc-platform-core/frequency/getFrequencysForSob?isValid=1', params)
}

// 查询操作日志列表
function getDoctorAdviceOpLog (params) {
  return axios.post(url + 'doctorAdviceController/getDoctorAdviceOpLog', params)
}

// 坚持发药，发药原因保存接口
function confirmMaterialOutStatus (params) {
  return axios.post(url + 'outpatientExecute/confirmMaterialOutStatus', params)
}

// 住院提交医嘱
function submitInpatientDoctorAdvice (params) {
  return axios.post(url + 'inpatientController/submitInpatientDoctorAdvice', params).then(res => {
    return res
  }).catch(() => {
    return false
  })
}

// 住院撤回待审核医嘱
function withdrawInpatientDoctorAdvice (params) {
  return axios.post(url + 'inpatientController/withdrawInpatientDoctorAdvice', params).then(res => {
    if (!res || res.head.errCode) {
      return false
    }
    return true
  }).catch(() => {
    return false
  })
}

// 住院停止医嘱
function stopInpatientDoctorAdvice (params) {
  return axios.post(url + 'inpatientController/stopInpatientDoctorAdvice', params).then(res => {
    if (!res || res.head.errCode) {
      return false
    }
    return true
  }).catch(() => {
    return false
  })
}

// 住院作废医嘱
function invalidInpatientDoctorAdvice (params) {
  return axios.post(url + 'inpatientController/invalidInpatientDoctorAdvice', params).then(res => {
    if (!res || res.head.errCode) {
      return false
    }
    return true
  }).catch(() => {
    return false
  })
}

// 校验是否存在有效医嘱
function queryHasValidAdvice (params) {
  return axios.post('/sob/doctorAdviceController/queryHasValidAdvice', params)
}

// 住院医嘱重整
function reformAdvice (params) {
  return axios.post('/sob/adviceReformController/reformAdvice', params).then(res => {
    if (res.data) {
      return res.data
    }
    return false
  }).catch(() => {
    return false
  })
}

// 查询重整医嘱记录接口
let reformRecordCache = {} // 缓存记录
function getReformRecord (list) {
  if (!list || !list.length) return false
  let params = {
    adviceReformIdList: []
  }
  list.forEach(item => {
    if (!reformRecordCache[item]) {
      params.adviceReformIdList.push(item)
    }
  })
  if (!params.adviceReformIdList.length) {
    return Promise.resolve(list.map(item => reformRecordCache[item]))
  }
  return axios.post('/sob/adviceReformController/getReformAdviceInfo', params).then(res => {
    if (res.data) {
      res.data.forEach(item => {
        reformRecordCache[item.id] = item
      })
      return list.map(item => reformRecordCache[item])
    }
    return false
  }).catch(() => false)
}

export default {
  queryHasValidAdvice,
  getDoctorAdviceInfo,
  getDoctorAdviceInfoForPage,
  createDoctorAdvice,
  updateDoctorAdviceForEdit,
  updateDoctorAdvice,
  getRecipeByVisitNumber,
  submitRecipeAdvice,
  removeRecipeAdvice,
  cancelRecipeAdvice,
  getExecuteRecordsByAdviceIds,
  getUsefreqList,
  getDoctorAdviceOpLog,
  confirmMaterialOutStatus,
  submitInpatientDoctorAdvice,
  withdrawInpatientDoctorAdvice,
  stopInpatientDoctorAdvice,
  invalidInpatientDoctorAdvice,
  reformAdvice,
  getReformRecord
}
