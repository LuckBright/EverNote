import { arrange as axios } from './api'
// const url = '/sob/'
const url1 = '/thc-queue/'
const url2 = '/warehouse/'
const urlarrange = '/arrange'

// 预检过号
function physicalCrossByAppointmentId (params) {
  return axios.post('/thc-queue/triageQueue/physicalCrossByAppointmentId', params)
}
// 获取预约记录
function getArea (params) {
  return axios.post(url2 + 'treatArea/getTreatAreaListByCondition/', params)
}
// 获取预约记录
function findTasksByPatientId (params) {
  return axios.post(url1 + 'doctor/triage/getToBeTriage', params)
}

// 到诊
// function completeTaskByTaskId (params) {
//   return axios.post(url + 'actionLog/completeTaskByTaskId', params)
// }

function completeTaskByTaskId (params) {
  return axios.post(url1 + 'triageQueue/completeTaskByTaskId', params)
}

// 获取待接诊等
function getTriageData (params) {
  return axios.post(url1 + 'triageQueue/getTriageQueuesByDiagnosisType', params)
}

function list (params) {
  return axios.post(url1 + 'triageQueue/getTriageQueuesByDiagnosisType', params)
}

async function getList (params) {
  return await axios.cancelPost(url1 + 'doctor/triage/search', params)
}

// 新~签到
function checkIn (params) {
  return axios.cancelPost(url1 + 'doctor/triage/checkIn', params)
}

// 分诊～医生
function changeDeptAndDoctor (params) {
  return axios.cancelPost(url1 + 'doctor/triage/changeDeptAndDoctor', params)
}

// 标记离开
function updateTriageQueue (params) {
  return axios.post(url1 + 'triageQueue/updateTriageQueue', params)
}
// 分诊
function getTriage (params) {
  return axios.post(url1 + 'triageQueue/triageQueueCountByDoctorId', params)
}
// 获取
function getPatient (params) {
  return axios.post(url1 + 'queueContent/queryCallNumBytimeFrame', params)
}
// 过号
function getNext (params) {
  return axios.post(url1 + 'queueContent/queryNext', params)
}

// 过号 + 叫号
function queryNextAndCallNum (params) {
  return axios.post(url1 + 'queueContent/queryNextAndCallNum', params)
}
// 根据诊区查询关联科室
function getTreatAreaInfoById (params) {
  return axios.post('warehouse/treatArea/getTreatAreaInfoById/', params)
}

// 根据科室查诊室
function getRoomRecordVoBySearch (params) {
  return axios.post('/thc-platform-core/out/room/getRoomListByParam', params)
}

// 根据科室查医生
function getSectionId (params) {
  return axios.post('/thc-platform-core/out/staff/getStaffListByCondition', params)
}

function queryGroupDepts (params) {
  return axios.post(urlarrange + '/dept/queryGroupDepts', params).then(result => {
    return result
  })
}
function add (params) {
  return axios.post(url1 + 'doctor/triageCheckInConfig/batchCreate', params).then(result => {
    return result
  })
}
function settinglist (params) {
  return axios.post(url1 + 'doctor/triageCheckInConfig/search', params).then(result => {
    return result
  })
}
// 预检叫号
function getCall (params) {
  return axios.post(url1 + 'triageQueue/physicalCallNumByAppointmentId', params)
}
// 预检叫号
function physicalCallNumByDeptId (params) {
  return axios.post(url1 + 'triageQueue/physicalCallNumByDeptId', params)
}
// 预检叫号
function physicalCrossByDeptId (params) {
  return axios.post(url1 + 'triageQueue/physicalCrossByDeptId', params)
}

export default {
  physicalCrossByAppointmentId,
  list,
  findTasksByPatientId,
  completeTaskByTaskId,
  getTriageData,
  updateTriageQueue,
  getTriage,
  getPatient,
  queryNextAndCallNum,
  getNext,
  getList,
  getArea,
  getTreatAreaInfoById,
  getCall,
  physicalCallNumByDeptId,
  physicalCrossByDeptId,
  queryGroupDepts,
  add,
  settinglist,
  checkIn,
  changeDeptAndDoctor,
  getRoomRecordVoBySearch,
  getSectionId
}
