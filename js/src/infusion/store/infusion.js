import axios from '@/util/http'
import { diction } from '@/store/common'
// const CancelToken = axios.CancelToken
// let source = ''
const url = diction.api
let api = axios.create({
  baseURL: url
})
api.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

api.interceptors.response.use(function (response) {
  if (!response) {
    return Promise.reject()
  }
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

// 入科
function getOutpatientQuickly (data) {
  return api.post('/workbench/task/getOutpatientQuickly', data)
}

// 诊室查询
function getTreatAreaListBySectionId (data) {
  return api.post('/workbench/outpatient/getTreatAreaListBySectionId', data)
}

// 历史患者
function getMyHistoryPatientList (data) {
  return api.post('/workbench/outpatient/getMyHistoryPatientList', data)
}

// 看诊队列
function queryMedicalSkillsForList (data) {
  return api.post('/thc-queue/triageQueue/queryMedicalSkillsForList', data)
}

// 叫号
function callNumTriageQueueByStationId (data) {
  return api.post('/thc-queue/triageQueue/callNumTriageQueueByStationId', data)
}

// 过号
function queryNextTriageQueueByStationId (data) {
  return api.post('/thc-queue/triageQueue/queryNextTriageQueueByStationId', data)
}
// 接诊
function receiveTriageQueueByStationId (data) {
  return api.post('/thc-queue/triageQueue/receiveTriageQueueByStationId', data)
}

// 快速接诊
function findPatientList (data) {
  return api.post('/sob/RecipeExcuteController/findPatientList', data)
}

// 是否接诊
function getVisitingPatient (data) {
  return api.post('/workbench/outpatient/getVisitingPatient', data)
}

// 医技-查询检查检验项目列表
function getRecipeByAdviceType (data) {
  return api.post('/sob/executeResult/getExecuteByAdviceType', data)
}

// 医技-文件上传及删除
function fileUpload (data) {
  return api.post('/sob/medicalTechnologyLog/fileUpload', data)
}

// 医技-完成检查及修改保存
function completeInspection (data) {
  return api.post('/sob/medicalTechnologyLog/completeInspection', data)
}

// 医技-查询日志
function getAllLog (data) {
  return api.post('/sob/medicalTechnologyLog/getAllLog', data)
}

// 更新执行单状态-发布报告
function updateAdviceStatus (data) {
  return api.post('/sob/medicalTechnologyLog/updateAdviceStatus', data)
}

// 报告查询组件：查询患者开立过的service
function getDistinctServiceByPatientId (data) {
  return api.post('/sob/executeResult/getDistinctServiceByPatientId', data)
}

// 报告查看组件：查看某个service的历史报告结果
function getExecuteTimeLineByServiceId (data) {
  return api.post('/sob/executeResult/getExecuteTimeLineByServiceId', data)
}

// 根据执行单id查询报告结果（单条）
function getResultByExecuteId (data) {
  return api.post('/sob/executeResult/getResultByExecuteId', data)
}

// 报告查看组件：批量点评报告
function commentReport (data) {
  return api.post('/sob/executeResult/commentReport', data)
}

// 更新危机值的处置内容
function updateDisposerContent (data) {
  return api.post('/sob/criticalValue/updateDisposerContent', data)
}

// 根据人员id获取人员信息和执业机构以及执业机构下的科室信息
function getWorkClinicAndSection (data) {
  return api.post('/thc-platform-core/out/staff/getStaffListHasSubjectByCondition', data)
}
// 根据科室查询房间
function getRoomListByParam (data) {
  return api.post('/thc-platform-core/out/room/getRoomListByParam', data)
}

// app推送
function updateDoctorAdviceById (data) {
  return api.post('/sob/doctorAdviceController/updateDoctorAdviceById', data)
}

// 接诊
function treatment (data) {
  return api.post('/thc-queue/doctor/queue/treatment', data)
}

function getStaffListHasOrgHasSubjectByCondition (data) {
  return api.post('/thc-platform-core/out/staff/getStaffListHasOrgHasSubjectByCondition', data)
}

function getStaffListHasOrgByCondition (data) {
  return api.post('/thc-platform-core/out/staff/getStaffListHasOrgByCondition', data)
}

// 查询医技检验队列
function getTechExecuteList (data) {
  return api.post('/sob/medicalTechnology/getTechExecuteList', data).then(res => {
    if (res) {
      return res
    }
    return []
  }).catch(() => [])
}

function rejectExecute (data) {
  return api.post('/sob/medicalTechnologyLog/rejectExecute', data)
}

function getTechTodoList (data) {
  return api.post('/sob/medicalTechnology/getTechTodoList', data)
}

// 批量登记
function registerBatch (data) {
  return api.post('/sob/medicalTechnology/registerBatch', data)
}
// 批量取消登记
function cancelRegisterBatch (data) {
  return api.post('/sob/medicalTechnology/cancelRegisterBatch', data)
}
// 查询平台配置接口

function getConfigInfoByApolloAgent (data) {
  return api.post('/sob/consultController/getConfigInfoByApolloAgent', data)
}

// 批量执行
function executeBatch (data) {
  return api.post('/sob/medicalTechnology/executeBatch', data)
}
// 批量取消执行
function cancelExecuteBatch (data) {
  return api.post('/sob/medicalTechnology/cancelExecuteBatch', data)
}

// 批量拒绝
function rejectBatch (data) {
  return api.post('/sob/medicalTechnology/rejectBatch', data)
}

// 批量取消拒绝
function cancelRejectBatch (data) {
  return api.post('/sob/medicalTechnology/cancelRejectBatch', data)
}
// 查看操作记录
function getTechOpLog (data) {
  return api.post('/sob/medicalTechnology/getTechOpLog', data)
}

// 上传报告/删除报告
function editPdfReport (data) {
  return api.post('/sob/medicalTechnology/editPdfReport', data)
}

// 发布报告/取消发布
function releaseReport (data) {
  return api.post('/sob/medicalTechnology/releaseReport', data)
}

export default {
  executeBatch,
  releaseReport,
  editPdfReport,
  getTechOpLog,
  cancelRejectBatch,
  rejectBatch,
  cancelExecuteBatch,
  getConfigInfoByApolloAgent,
  cancelRegisterBatch,
  registerBatch,
  getTechTodoList,
  rejectExecute,
  getStaffListHasOrgByCondition,
  getStaffListHasOrgHasSubjectByCondition,
  treatment,
  updateDoctorAdviceById,
  getRoomListByParam,
  getWorkClinicAndSection,
  updateDisposerContent,
  commentReport,
  getResultByExecuteId,
  getExecuteTimeLineByServiceId,
  getDistinctServiceByPatientId,
  updateAdviceStatus,
  getOutpatientQuickly,
  getTreatAreaListBySectionId,
  getMyHistoryPatientList,
  queryMedicalSkillsForList,
  callNumTriageQueueByStationId,
  queryNextTriageQueueByStationId,
  receiveTriageQueueByStationId,
  findPatientList,
  getVisitingPatient,
  getRecipeByAdviceType,
  fileUpload,
  completeInspection,
  getAllLog,
  getTechExecuteList
}
