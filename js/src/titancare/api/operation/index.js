import { getInstance } from '../api'

const axios = getInstance()

let urlDoc = '/titan-doctor/'
let urlCms = '/titan-cms/'
let urlArrange = '/arrange/'

// 获取待审核账号列表
function searchCertDoctor (params) {
  return axios.post(`${urlDoc}docAccount/v1.1/searchCertDoctor`, params)
}

// 批量账号审核
function checkCertDoctorBatch (params) {
  return axios.post(`${urlDoc}docAccount/v1.1/checkCertDoctorBatch`, params)
}

// 账号审核
function checkCertDoctor (params) {
  return axios.post(`${urlDoc}docAccount/v1.1/checkCertDoctor`, params)
}

// 获取专业技能职称列表
function getTitleCodeTwo (params) {
  return axios.get(`${urlDoc}docAccount/v1.1/getTitleCodeTwo`, params)
}

// 获取科室列表
function getValueListBySetCode () {
  return axios.post(`${urlCms}v1.0/valueSet/getValueListBySetCode`, { setCode: ['CT08.00.002'] })
}

// 获取机构列表
function getOrgListByCondition (params) {
  return axios.post(`${urlDoc}platformCore/v1.1/clinic/getClinicList`, params)
}

// 获取机构下科室列表
function getSections (params) {
  return axios.post(`${urlDoc}platformCore/v1.1/section/getSections`, params)
}

// 保存审核/发货列表
function getSearchInfo (params) {
  return axios.post(`${urlCms}recipeOrder/v1.1/search`, params)
}

// 处方审核-获取图文问诊信息
function getByOrderNo (params) {
  return axios.get(`${urlCms}/v1.1/getByOrderNo/${params.orderNo}`)
}

// 查询诊断
function getMedicalRecordByVisitNumber (params) {
  return axios.get(`${urlCms}getMedicalRecordByVisitNumber?visitNumber=${params.visitNumbers}`)
}

// 查询处方详细信息
function getRecipeOrderDetail (params) {
  return axios.get(`${urlCms}recipeOrder/v1.1/getRecipeOrderDetail?recipeOrderId=${params.recipeOrderId}`)
}

// 查看电子处方
function getElectronicRecipe (params) {
  return axios.post(`${urlCms}recipeOrder/v1.1/getElectronicRecipe`, params)
}

// 处方审核-批量审核
function setBatchAuditPass (params) {
  return axios.post(`${urlCms}recipeOrder/v1.1/batchAuditPass`, params)
}

// 处方审核-未审核总数
function getUnAuditCount () {
  return axios.get(`${urlCms}recipeOrder/v1.1/getUnAuditCount`)
}

// 图文问诊-获取列表
function searchlist (params) {
  return axios.post(`${urlArrange}appt/third-party/queryList`, params)
}
function getOrderInfo (params) {
  return axios.post(`${urlArrange}appt/third-party/getByVisitNumber`, params)
}

// 图文问诊-订单状态
function payStatus () {
  return axios.get(`${urlArrange}enum/getPaidStates`, { params: { isIh: true } })
}

// 图文问诊-问诊状态
function counselStatus () {
  return axios.get(`${urlArrange}enum/getApptStates`, { params: { apptType: 2, isIh: true } })
}

// 图文问诊-退费
function refund (params) {
  return axios.post(`${urlCms}admin/refund`, params)
}

// 图文问诊-获取退费详情
function findRefund (params) {
  return axios.get(`${urlCms}admin/findRefund/${params}`)
}

function getGroupId (params) {
  return axios.get(`${urlCms}admin/getGroupId/${params}`)
}
// 图文问诊-获取图片路径
function getFileUrl () {
  return axios.get(`${urlCms}getFileUrl`)
}

// 图文问诊-获取病历
function getByCodeAndVisitId (params) {
  return axios.post(`${urlDoc}medicalRecord/v1.0/doctor/medicalRecord/getByCodeAndVisitId`, { ...params.data }, params.config)
}

// 图文问诊-获取医嘱
function getRecipeDetailByVisitNumber (params) {
  return axios.get(`${urlCms}recipeOrder/v1.1/getRecipeDetailByVisitNumber?visitNumber=${params}`)
}

// 图文问诊-获取会话成员信息
function getGroupMember (params) {
  return axios.get(`${urlCms}getGroupMember2/${params}`)
}

// 发药管理-获取处方订单的物流列表
function getAddressList (params) {
  return axios.get(`${urlCms}recipeDeliver/v1.1/listDeliverAndAdviceByRecipeOrderId?recipeOrderId=${params.recipeOrderId}&orgId=${params.orgId}`)
}

// 发药管理-查看快递
function query (params) {
  return axios.post(`${urlCms}v1.1/express/query`, params)
}

// 发药管理-查看相同收货订单
function sameAddressRecipeOrder (params) {
  return axios.get(`${urlCms}recipeDeliver/v1.1/sameAddressRecipeOrder?recipeOrderId=${params.recipeOrderId}`)
}

// 发药管理-发药
function goDeliver (params) {
  return axios.post(`${urlCms}recipeDeliver/v1.1/deliver`, params)
}

// 发药管理-获取物流公司
function queryCom (params) {
  return axios.post(`${urlCms}v1.1/express/queryCom`, params)
}

// 发药管理-获取分药包裹数量
function deliverNum (params) {
  return axios.get(`${urlCms}recipeDeliver/v1.1/deliverNum?recipeOrderId=${params.recipeOrderId}`)
}

// 获取医嘱列表项
function getRecipeAvailableByVisitNumber (params) {
  return axios.post(`${urlDoc}sobApi/v2.0/recipe/getRecipeAvailableByVisitNumber`, { ...params.data }, params.config)
}

// 图文问诊-获取历史
function getImRecordList (params) {
  return axios.post(`${urlCms}getImRecordList`, params)
}

// 处方审核-审核通过
function goPass (params) {
  return axios.post(`${urlCms}recipeOrder/v1.1/pass`, params)
}

// 处方审核-审核不通过
function refuse (params) {
  return axios.post(`${urlCms}recipeOrder/v1.1/refuse`, params)
}

// 获取标签列表
function getValueSetItemsForWeb (params) {
  return axios.post(`thc-platform-core/valueSetItem/getValueSetItemsForWeb`, params)
}

// 获取标签列表
function createValueSetItem (params) {
  return axios.post(`thc-platform-core/valueSetItem/createValueSetItem`, params)
}

export default {
  searchCertDoctor,
  checkCertDoctorBatch,
  checkCertDoctor,
  getTitleCodeTwo,
  getValueListBySetCode,
  getOrgListByCondition,
  getSections,
  getSearchInfo,
  getByOrderNo,
  getMedicalRecordByVisitNumber,
  getRecipeOrderDetail,
  getElectronicRecipe,
  setBatchAuditPass,
  getUnAuditCount,
  searchlist,
  payStatus,
  counselStatus,
  refund,
  findRefund,
  getFileUrl,
  getByCodeAndVisitId,
  getRecipeDetailByVisitNumber,
  getGroupMember,
  getAddressList,
  query,
  sameAddressRecipeOrder,
  goDeliver,
  queryCom,
  deliverNum,
  getRecipeAvailableByVisitNumber,
  getImRecordList,
  goPass,
  refuse,
  getValueSetItemsForWeb,
  createValueSetItem,
  getOrderInfo,
  getGroupId
}
