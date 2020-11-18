// 发药公共api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'outpatientDispense/'
const expressUrl = 'expressInformation/'
const companyUrl = 'expressCompany/'
const outpatientUrl = 'outpatientDispense/'
const materUrl = 'materialRecipeComment/'
// 根据visitsn展示左侧分页列表
function getDispenseVisitSnList (params) {
  return axios.post(url + 'getOutpatientDispensePrintVisitSnList/', params).then(result => {
    return result
  })
}

// 根据visitsnId展示右侧详情
function getDispenseByVisitSn (params) {
  return axios.post(url + 'getOutpatientDispensePrintListByVisitSn/', params).then(result => {
    return result
  })
}
// 批量打印/打印操作
function updateDispensePrint (params) {
  return axios.post(url + 'updateOutpatientDispensePrint/', params).then(result => {
    return result
  })
}
// 单人打印操作
function printOutpatientDispenseAndItem (params) {
  return axios.post(url + 'printOutpatientDispenseAndItem/', params).then(result => {
    return result
  })
}

// 获取异常列表
function getDispenseInfo (params) {
  return axios.post(url + 'getOutpatientDispenseInfoByOutpatientDispenseIds/', params).then(result => {
    return result
  })
}

// 无法到货
function UnableToArrive (params) {
  return axios.post(url + 'createMessageForCpoe/', params).then(result => {
    return result
  })
}

// 异常标记
function updateDispenseIdentification (obj) {
  return axios.post(url + 'updateOutpatientDispenseIdentification/', obj)
}

// 批量操作摆药单
function updateDispenseStatus (obj) {
  return axios.post(url + 'updateDispenseStatus/', obj)
}

// 重新打印摆药单
function updateRepeatOutpatientDispensePrint (obj) {
  return axios.post(url + 'updateRepeatOutpatientDispensePrint/', obj)
}

// 查看邮寄信息列表
function getExpressInformationList (obj) {
  return axios.post(expressUrl + 'getExpressInformationList/', obj)
}
// 编辑发药邮寄信息
function updateExpressInformation (obj) {
  return axios.post(outpatientUrl + 'updateOutPatientDispenseForExpressInformation/', obj)
}
// 查询快递公司
function getExpressCompanyList (obj) {
  return axios.post(companyUrl + 'getExpressCompanyList/', obj)
}
// 门诊皮试结果查询
function getOutPatientSkinTest (obj) {
  return axios.post(url + 'getOutPatientSkinTest/', obj)
}
// 新版标记异常
function updateComment (obj) {
  return axios.post(materUrl + 'comment/', obj)
}
// 新版异常标记获取详情
function getDetail (obj) {
  return axios.post(materUrl + 'detail/', obj)
}
// 新版异常取消
function materialRecipeCommentCancel (obj) {
  return axios.post(materUrl + 'cancel/', obj)
}
// 药房 单人操作 获取右侧患者处方集合
function getOutpatientDispenseListForCoordinationByVisitSn (obj) {
  return axios.post(url + 'getOutpatientDispenseListForCoordinationByVisitSn/', obj)
}
// 药房 单人操作 获取左侧患者列表
function getOutpatientDispenseListForCoordination (obj) {
  return axios.post(url + 'getOutpatientDispenseListForCoordination/', obj)
}
// 药房 单人操作 批量操作备药 发药
function updateDispenseStatusForCoordination (obj) {
  return axios.post(url + 'updateDispenseStatusForCoordination/', obj)
}
//  门诊 患者查询 左侧列表
function getAllPatientByVisitsnAndDoctor (obj) {
  return axios.post(url + 'getAllPatientByVisitsnAndDoctor/', obj)
}
//  门诊 患者查询 左侧列表
function getOutpatientDispenseListForPatient (obj) {
  return axios.post(url + 'getOutpatientDispenseListForPatient/', obj)
}
//  门诊 处方查询 左侧列表
function getAllOutpatientDispense (obj) {
  return axios.post(url + 'getAllOutpatientDispense/', obj)
}
//  门诊 处方查询 右侧处方详情
function getOneOutpatientDispense (obj) {
  return axios.post(url + 'getOneOutpatientDispense/', obj)
}
export default {
  getDispenseVisitSnList,
  getDispenseByVisitSn,
  getExpressCompanyList,
  updateDispensePrint,
  UnableToArrive,
  getExpressInformationList,
  updateExpressInformation,
  updateComment,
  materialRecipeCommentCancel,
  getDetail,
  getDispenseInfo,
  updateDispenseIdentification,
  updateDispenseStatus,
  updateRepeatOutpatientDispensePrint,
  getOutPatientSkinTest,
  getOutpatientDispenseListForCoordinationByVisitSn,
  getOutpatientDispenseListForCoordination,
  updateDispenseStatusForCoordination,
  printOutpatientDispenseAndItem,
  getAllPatientByVisitsnAndDoctor,
  getAllOutpatientDispense,
  getOneOutpatientDispense,
  getOutpatientDispenseListForPatient
}
