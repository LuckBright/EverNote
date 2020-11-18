import {workspace as axios} from './api'
import {diction} from '@/store/common'

const url = '/phr/'
const url1 = '/c-union/'
const url2 = '/arrange/'
const url3 = '/insurance/'
const url4 = '/rcm/'
function search (data) {
  return axios.post('/medical-record/doctor/valuationList/search', data)
}

// 查看是不是已经接诊了
function checkIsEncounterByVisitNumber (data) {
  return axios.post('/thc-queue/doctor/queue/checkIsEncounterByTriageId', data)
}

// 手动结诊
function updateStatusByVisitNumber4Clinic (data) {
  return axios.post('/arrange/appointment/updateStatusByVisitNumber4Clinic', data)
}

// 接诊
function treatment (data) {
  return axios.post('/thc-queue/doctor/queue/treatment', data)
}

// 同一版本表头信息
function getPatientMsg (data) {
  return axios({
    url: '/thc-phr/doctor/patientInfoHead/getPatientInfoHead',
    method: 'post',
    data: data
  })
}
// 获取患者列表 820新版
function getQueueContentBytimeFrame (data) {
  return axios({
    url: '/thc-queue/queueContent/getQueueContentBytimeFrame',
    method: 'post',
    data: data
  })
}

// 接诊以后修改状态
function appointUpdate (data) {
  return axios({
    url: '/arrange/appointment/updateStatusById4Clinic',
    method: 'post',
    data: data
  })
}

// 获取门诊工作台表头信息
function getPageHeadByPatientId (data) {
  return axios({
    url: '/phr/doctor/newMedicalRecord/getPageHeadByPatientId',
    method: 'post',
    data: data
  })
}

// 新生儿登记
function neonateCreate (data) {
  return axios({
    url: '/sob/neonate/create',
    method: 'post',
    data: data
  })
}

// 获取住院申请列表
function getAdmissionApplication (data) {
  return axios({
    url: '/adt/doctor/apply/getList',
    method: 'post',
    data: data
  })
}

// 撤回住院信息
function cancel (data) {
  return axios({
    url: '/adt/doctor/apply/cancel',
    method: 'post',
    data: data
  })
}

// 扫码获取待办任务

function getOutpatientQuickly (msg) {
  return axios({
    url: '/workbench/task/getOutpatientQuickly',
    method: 'post',
    data: {
      patientMsg: msg
    }
  })
}

// 获取历史患者

function getMyHistoryPatientList (data) {
  return axios({
    url: '/workbench/outpatient/getMyHistoryPatientList',
    method: 'post',
    data: data
  })
}
// 体征信息
function getBodyCheck (id) {
  return axios.get(url + 'doctor/bodyCheck/getLatestByPatientId', {
    params: {
      patientId: id
    }
  })
}

// 接诊
function deletqueueContentById (data) {
  return axios.post('/thc-queue/queueContent/deletqueueContentById', data)
}

// 过敏史
function getAllergic (id) {
  return axios.get(url + 'doctor/medicalRecord/getLatestByPatientId', {
    params: {
      patientId: id
    }
  })
}

// 更新头像信息
function updataUserAvt (params) {
  return axios.get(url1 + 'doctor/patient/modifyPic', {
    params: params
  })
}

// 查看头像
function getUserAvt (params) {
  return axios.get('/c-union/doctor/patient/getById', {
    params: params
  })
}

// 保险信息
function getInsurInfo (params) {
  return axios.post(url2 + 'appoint/getInsuranceByVisitNumber', params)
}

// 查询基础社保信息
function getMedicialInfo (n) {
  return axios.post(url4 + 'ar/settlement/getMedPersonInfo', {visitNumber: n})
}
// 是否开启信息共享
function getShareInfo (params) {
  return axios.post(url3 + 'doctorAdvice/parameter/getByCode', {parameterCode: 'CHECKOUT_MEDICINE'})
}

// 保存医保历史交易数据
function getTradeList (params) {
  return axios.post(url3 + 'clinicHistoryTrade/clinicHistoryTradeSave', params)
}

function getClinicList (icno) {
  return axios.post('http://127.0.0.1:9099/getClinicHistoryTrade', {icno: icno})
}

// 获取当前医生站设置的超时时长
function getTimeout (string) {
  return axios.post(url3 + 'doctorAdvice/parameter/getByCode', {parameterCode: 'TIMEOUT'})
}

// 获取医嘱共享查询主信息
function getByIcon (icno) {
  return axios.post(url3 + 'doctorAdvice/sysinfo/getByIcno', {icno: icno})
}
// 获取医嘱原始交易信息
function tradeList (params) {
  return axios.post(url3 + 'doctorAdvice/tradeinfo/listByIcno', params).then(res => {
    res.data.totalCount = res.totalCount
    return res
  })
}
// 获取医嘱药品明细列表
function druginfoList (params) {
  return axios.post(url3 + '/doctorAdvice/feeitem/listByParameter', params)
}
// 获取护士
function getStaff (params) {
  return axios.post('/warehouse/staffRecord/getStaffRecordVoListForService/', params)
}
// 新生儿记录创建
function createNewborn (params) {
  return axios.post('/workbench/neonate/create', params)
}
function manualDiagnosis (data) {
  return axios.post('/workbench/task/manualDiagnosis', data)
}
function queryHospitalAdviceByHospitalNumber (params) {
  return axios.post(`/sob/medicalOrder/queryHospitalAdviceByHospitalNumber`, params)
}

function getBabyName (params) {
  return axios.post(`/workbench/neonate/getBabyName`, params)
}

// 完成诊断
function completeDiagnose (params) {
  return axios.post(`/arrange/appointment/completeDiagnose`, params)
}

// 取消接诊
function cancelTreatment (params) {
  return axios.post(`/thc-queue/doctor/queue/cancelTreatment`, params)
}

export default {
  cancelTreatment,
  completeDiagnose,
  getBabyName,
  queryHospitalAdviceByHospitalNumber,
  search,
  manualDiagnosis,
  getBodyCheck,
  getAllergic,
  updataUserAvt,
  getUserAvt,
  diction,
  getInsurInfo,
  getShareInfo,
  getClinicList,
  getTradeList,
  getTimeout,
  getByIcon,
  tradeList,
  getPatientMsg,
  druginfoList,
  getMedicialInfo,
  getOutpatientQuickly,
  getAdmissionApplication,
  cancel,
  treatment,
  neonateCreate,
  getMyHistoryPatientList,
  getPageHeadByPatientId,
  appointUpdate,
  getQueueContentBytimeFrame,
  deletqueueContentById,
  getStaff,
  createNewborn,
  updateStatusByVisitNumber4Clinic,
  checkIsEncounterByVisitNumber
}
