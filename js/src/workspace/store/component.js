import { workspace as axios } from './api'
const url = '/thc-phr/'
function diagonoseSearch (params) {
  return axios.post(url + 'doctor/diagonose/search', params).then(result => {
    return result
  })
}

// 检验查询
function inspectionSearch (params) {
  return axios.post(url + 'doctor/inspection/search', params).then(result => {
    return result
  })
}

// 检验报告详细内容
function getByInspectionId (params) {
  return axios
    .post(url + 'doctor/inspectionResultDetail/getByInspectionId', params)
    .then(result => {
      return result
    })
}
// 获取检验报告
function getPdfByInspectionId (params) {
  return axios
    .post(url + 'doctor/inspectionResult/getPdfByInspectionId', params)
    .then(result => {
      return result
    })
}

// 检验历史对比
function compareResultDetail (params) {
  return axios
    .post(url + 'doctor/inspection/compareResultDetail', params)
    .then(result => {
      return result
    })
}

// 获取患者全部就诊记录
function getAllVisit (params) {
  return axios.post(url + 'doctor/visit/getAll', params).then(result => {
    return result
  })
}
// 门诊医嘱视图查询
function opAdviceView (params) {
  return axios.post(url + 'doctor/opAdviceView/search', params).then(result => {
    return result
  })
}
// 门诊处方视图
function opPrescriptionView (params) {
  return axios.post(url + 'doctor/opPrescriptionView/search', params).then(result => {
    return result
  })
}

// 检查视图
function examineView (params) {
  return axios.post(url + 'doctor/examineView/search', params).then(result => {
    return result
  })
}

// 预约记录分页
function getAppointment (params) {
  return axios.post(url + 'doctor/appointment/search', params).then(result => {
    return result
  })
}
// 获取检验次数
function getCount (params) {
  return axios.post(url + 'doctor/inspection/count', params).then(result => {
    return result
  })
}
// 添加病案首页
function addHomePage (params) {
  return axios.post('/medical-record/doctor/medicalRecord/addHomePage', params).then(result => {
    return result
  })
}
// 获取病案首页
function getHomePage (params) {
  return axios.post(`/medical-record/doctor/medicalRecord/getHomePageByVisitId?visitId=${params.visitId}`).then(result => {
    return result
  })
}
// 病案首页回显
function getEchoData (params) {
  return axios.post(`/medical-record/doctor/medicalRecord/homePage/getEchoData`, params).then(result => {
    return result
  })
}
// 获取病案首页路径
function getByCodeAndOrgId (params) {
  return axios.post(`/medical-record/doctor/systemConfigRelation/getByCodeAndOrgId`, params)
}
// 获取病案首页路径
function getByCode (params) {
  return axios.get(`/medical-record/doctor/systemConfigRelation/getByCode?code=HOME_PAGE_TYPE`, params)
}
// 获取中医吉林
function jilin (params) {
  return axios.post(`/medical-record/doctor/medicalRecord/getChineseMedicineHomePageByVisitId?visitId=${params.visitId}`).then(result => {
    return result
  })
}
// 回显中医吉林
function echoJilin (params) {
  return axios.post(`/medical-record/doctor/medicalRecord/ChineseMedicineHomePage/getEchoData`, params).then(result => {
    return result
  })
}
// 添加中医吉林
function addJilin (params) {
  return axios.post(`/medical-record/doctor/medicalRecord/addChineseMedicineHomePage`, params).then(result => {
    return result
  })
}
// phr 病案首页
function getHomePageById (params) {
  return axios.post(`/thc-phr/cpoe/phrHomePage/getHomePageById`, params).then(result => {
    return result
  })
}
export default {
  getHomePageById,
  addJilin,
  echoJilin,
  jilin,
  getByCode,
  getEchoData,
  getHomePage,
  addHomePage,
  getCount,
  diagonoseSearch,
  inspectionSearch,
  getByInspectionId,
  compareResultDetail,
  opAdviceView,
  getAllVisit,
  examineView,
  getAppointment,
  opPrescriptionView,
  getPdfByInspectionId,
  getByCodeAndOrgId
}
