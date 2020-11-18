import { base as axios } from './api'
const url = '/empi/doctorAccount/'
const userInfo = {
  checkUserId: window.localStorage.getItem('USERID'),
  checkUserName: `${window.localStorage.getItem('USERACCOUNT')}(${window.localStorage.getItem('USERNAME')})`
}
// 新增医生账号
function createAccountByPlatform (params) {
  Object.assign(params, userInfo)
  return axios.post(url + 'createAccountByPlatform', params).then(result => {
    return result
  })
}
// 编辑医生账号
function updateAccountByPlatform (params) {
  Object.assign(params, userInfo)
  return axios.post(url + 'updateAccountByPlatform', params).then(result => {
    return result
  })
}
// 医生账号列表
function searchDocAccount (params) {
  Object.assign(params, userInfo)
  return axios.post(url + 'search', params).then(result => {
    return result
  })
}

// 修改执业信息接口
function saveDocThcTenantInfo (localhost, params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-doctor/docAccount/v1.1/saveDocThcTenantInfo', params).then(result => {
    return result
  })
}

// 获得租户列表
async function getTenants () {
  const list = await axios.get('/global-platform/sys/permission/getTenants')
  return Promise.all(list.map(item => getTenantInfo(item.tenantId))).then(data => {
    const lastList = JSON.parse(JSON.stringify(list))
    lastList.forEach(p => {
      data && data.length && data.map(m => {
        if (p.tenantId === m.tenantId) {
          m.envInfos.map(v => {
            if (v.appType === 'titan') p.fullGroupDomainName = v.envId
          })
        }
      })
    })
    return lastList
  })
}

// 根据租户id得域名
function getTenantInfo (params) {
  return axios.get('/global-platform/internal/tenant/getTenantInfo?tenantId=' + params).then(res => {
    return res
  })
}

// 获取机构列表
function getOrgListByCondition (params) {
  return axios.post('/titan-doctor/platformCore/v1.1/clinic/getClinicList', params).then(result => {
    return result
  })
}

// 获取机构下科室列表
function getSections (params) {
  return axios.post('/titan-doctor/platformCore/v1.1/section/getSections', params).then(result => {
    return result
  })
}

// 批量修改医生账号状态
function updateAccountStatusBatch (params) {
  // Object.assign(params, userInfo)
  params.forEach(items => {
    Object.assign(items, userInfo)
  })
  return axios.post(url + 'updateAccountStatusBatch', params).then(result => {
    return result
  })
}

// 获取职称列表
function getTitleCodeTwo () {
  return axios.get(url + 'getTitleCodeTwo').then(result => {
    return result
  })
}

// 获取待审核账号列表
function searchCertDoctor (params) {
  return axios.post('/titan-doctor/docAccount/v1.1/searchCertDoctor', params).then(result => {
    return result
  })
}
// 账号审核
function checkCertDoctor (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-doctor/docAccount/v1.1/checkCertDoctor', params).then(result => {
    return result
  })
}

// 批量账号审核
function checkCertDoctorBatch (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-doctor/docAccount/v1.1/checkCertDoctorBatch', params).then(result => {
    return result
  })
}

// 获取科室列表
function getValueListBySetCode () {
  return axios.post('/global-platform/valueSet/getValueListBySetCode', { setCode: ['CT08.00.002'] }).then(result => {
    return result
  })
}

// 获取药师基本信息
function searchPlatformAccount (params) {
  return axios.post(url + 'searchPlatformAccount', params).then(result => {
    return result
  })
}
// 获取专业技能职称列表
function getTitleCodeTwoYS (params) {
  return axios.get(url + 'getTitleCodeTwoYS', params).then(result => {
    return result
  })
}

// 保存绑定账户
function savePlatformThcTenantInfo (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-doctor/docAccount/v1.1/savePlatformThcTenantInfo', params).then(result => {
    return result
  })
}

// 保存审核/发货列表
function getSearchInfo (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/recipeOrder/v1.1/search', params).then(result => {
    return result
  })
}
// 查询诊断
function getMedicalRecordByVisitNumber (params) {
  Object.assign(params, userInfo)
  return axios.get('/titan-cms/getMedicalRecordByVisitNumber?visitNumber=' + params.visitNumbers).then(result => {
    return result
  })
}
// 查询处方详细信息
function getRecipeOrderDetail (params) {
  Object.assign(params, userInfo)
  return axios.get('/titan-cms/recipeOrder/v1.1/getRecipeOrderDetail?recipeOrderId=' + params.recipeOrderId).then(result => {
    return result
  })
}
// 查看电子处方
function getElectronicRecipe (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/recipeOrder/v1.1/getElectronicRecipe', params).then(result => {
    return result
  })
}
// 处方审核-获取图文问诊信息
function getByOrderNo (params) {
  Object.assign(params, userInfo)
  return axios.get('/titan-cms/v1.1/getByOrderNo/' + params.orderNo).then(result => {
    return result
  })
}
// 处方审核-审核通过
function goPass (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/recipeOrder/v1.1/pass', params)
}
// 处方审核-审核不通过
function refuse (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/recipeOrder/v1.1/refuse', params)
}
// 处方审核-批量审核
function setBatchAuditPass (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/recipeOrder/v1.1/batchAuditPass', params)
}
// 处方审核-未审核总数
function getUnAuditCount () {
  return axios.get('/titan-cms/recipeOrder/v1.1/getUnAuditCount')
}
// 获取平台账户信息
function getCurrentUser () {
  return axios.get('/global-platform/sys/user/getCurrentUser')
}
// 发药管理-发药
function goDeliver (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/recipeDeliver/v1.1/deliver', params)
}
// 发药管理-获取物流公司
function queryCom (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/v1.1/express/queryCom', params)
}
// 发药管理-查看快递
function query (localhost, params) {
  Object.assign(localhost, userInfo)
  return axios.post('/titan-cms/v1.1/express/query', localhost)
}
// 发药管理-查看相同收货订单
function sameAddressRecipeOrder (localhost, params) {
  return axios.get('/titan-cms/recipeDeliver/v1.1/sameAddressRecipeOrder?recipeOrderId=' + params.recipeOrderId)
}
// 发药管理-获取分药包裹数量
function deliverNum (params) {
  return axios.get('/titan-cms/recipeDeliver/v1.1/deliverNum?recipeOrderId=' + params.recipeOrderId)
}
// 发药管理-获取处方订单的物流列表
function getAddressList (params) {
  return axios.get('/titan-cms/recipeDeliver/v1.1/listDeliverAndAdviceByRecipeOrderId', {params})
}

// 图文问诊-获取列表
function searchlist (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/admin/tw/order/search', params)
}

// 图文问诊-订单状态
function payStatus () {
  return axios.get('/titan-cms/admin/payStatus')
}
// 图文问诊-问诊状态
function counselStatus () {
  return axios.get('/titan-cms/admin/counselStatus')
}
// 图文问诊-获取图片路径
function getFileUrl () {
  return axios.get('/titan-cms/getFileUrl')
}
// 图文问诊-获取医嘱-新
function getRecipeDetailByVisitNumberAndSettlementId (params, settlementId) {
  return axios.get('/titan-cms/recipeOrder/v1.1/getRecipeDetailByVisitNumber?visitNumber=' + params + '&settlementId=' + settlementId)
}
function getRecipeAvailableByVisitNumberAndSettlementId (params) {
  return axios.post('/titan-doctor/sobApi/v2.0/recipe/getRecipeAvailableByVisitNumber', { visitNumber: params.data.visitNumber, settlementId: params.data.settlementId }, params.config)
}
// 图文问诊-获取退费详情
function findRefund (params) {
  return axios.get('/titan-cms/admin/findRefund/' + params)
}
// 图文问诊-退费
function refund (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/admin/refund', params)
}
// 图文问诊-获取病历
function getByCodeAndVisitId (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-doctor/medicalRecord/v1.0/doctor/medicalRecord/getByCodeAndVisitId', params, params.config)
}
// 图文问诊-获取会话成员信息
function getGroupMember (params) {
  return axios.get('/titan-cms/getGroupMember2/' + params)
  // return axios.get('http://' + 'testsyzx.everjiankang.com.cn' + '/titan-cms/getGroupMember2/' + params)
}
// 图文问诊-获取历史
function getImRecordList (params) {
  Object.assign(params, userInfo)
  return axios.post('/titan-cms/getImRecordList', params)
}

// 发药管理-获取处方订单的物流列表
function getRecipeId (params) {
  return axios.get('/titan-cms/recipeOrder/getRecipeOrderIdByRecipeId?recipeId=' + params.recipeId)
}

// 三方发药供应商快递信息
function getTransInfo (params) {
  return axios.get('/titan-cms/recipel-roam/thc-api/order/getOrderExpress', {params: params})
}

// 三方发药供应商快递信息
function getSupplyInfo (params) {
  return axios.post('/titan-cms/recipel-roam/thc-api/supplierRelation/listSupplierInfoAndRelation', params)
}

export default {
  getTenants,
  getSections,
  checkCertDoctor,
  getTitleCodeTwo,
  searchDocAccount,
  searchCertDoctor,
  checkCertDoctorBatch,
  saveDocThcTenantInfo,
  getValueListBySetCode,
  getOrgListByCondition,
  updateAccountByPlatform,
  createAccountByPlatform,
  updateAccountStatusBatch,
  searchPlatformAccount,
  savePlatformThcTenantInfo,
  getTitleCodeTwoYS,
  getSearchInfo,
  getMedicalRecordByVisitNumber,
  getRecipeOrderDetail,
  getElectronicRecipe,
  getByOrderNo,
  goPass,
  refuse,
  getCurrentUser,
  getUnAuditCount,
  setBatchAuditPass,
  goDeliver,
  sameAddressRecipeOrder,
  getAddressList,
  deliverNum,
  queryCom,
  query,
  searchlist,
  payStatus,
  counselStatus,
  getFileUrl,
  getRecipeAvailableByVisitNumberAndSettlementId,
  getRecipeDetailByVisitNumberAndSettlementId,
  refund,
  findRefund,
  getByCodeAndVisitId,
  getGroupMember,
  getImRecordList,
  getTenantInfo,
  getRecipeId,
  getTransInfo,
  getSupplyInfo
}
