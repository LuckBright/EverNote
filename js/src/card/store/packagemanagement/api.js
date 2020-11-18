import axios from '@/rcm/store/api'
import axioss from '@/insurance/store/api'
import { diction } from '@/store/common'
const baseurl = diction.api
function getStatusList (params) {
  return axios.get(baseurl + '/market/doctor/setmeal/getStatusAll', { params: params })
}
// 获取机构所有套餐
function getPackageList (params) {
  return axios.get(baseurl + '/market/doctor/setmeal/search', { params: params })
}
// 根据机构id获取套餐的所有信息
function getPackageById (params) {
  return axios.get(baseurl + '/market/doctor/setmeal/getById', { params: params })
}
// 删除套餐
function deletePackageById (params) {
  return axios.post(baseurl + '/market/doctor/setmeal/delete', params)
}
/**
 * 以下为目录项的接口信息
 */
// 根据目录id获取该目录的所有信息
function getDirectorysById (params) {
  return axios.get(baseurl + '/market/doctor/setmealcatalog/getById', { params: params })
}
function createOrUpdate (params) {
  return axios.post(baseurl + '/market/doctor/setmeal/createOrUpdate', params)
}
// function createDirectory (params) {
//   return axios.post(baseurl + '/market/doctor/setmealcatalog/create', params)
// }
// function updateDirectory (params) {
//   return axios.post(baseurl + '/market/doctor/setmealcatalog/update', params)
// }
function createOrUpdateDirectory (params) {
  return axios.post(baseurl + '/market/doctor/setmealcatalog/createOrUpdate', params)
}
function deleteDirectory (params) {
  return axios.post(baseurl + '/market/doctor/setmealcatalog/delete', params)
}
/**
 * 以下为医嘱项的接口
 */
// 创建医嘱项
function createOrupdateMeal (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/createOrUpdate', params)
}
// 删除医嘱项
function deleteMealById (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/delete', params)
}
// 交换顺序
function changeOrderNum (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/changeOrder', params)
}
// 根据机构获取机构下方所有科室
function getDptsByOrgId (params) {
  // console.error('调用科室新组件，见demo')
  return axios.post(baseurl + '/thc-platform-core/out/subject/getTenantSubjectListByCondition/', params)
}
// 获取账号所在机构
function getClinicInfo (params) {
  return axios.post(baseurl + '/insurance/insuranceOrg/getClinicInfo', params)
}
// 引用接口
function addMealDetailByQuote (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/copyDetails', params)
}
// 更改医嘱项目折后金额，反算折扣
function updateTotalPriceDis (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/updateTotalPriceDis', params)
}
function updateMoreTotalPriceDis (params) { // 套餐明细（医嘱）-按目录反算折扣价
  return axios.post(baseurl + '/market/doctor/setmealdetail/updateMoreTotalPriceDis', params)
}
// 根据医嘱id获取医嘱detailes
function getDetailesById (params) {
  return axios.get(baseurl + '/market/doctor/setmealdetail/getById', { params: params })
}
/**
 * 以下为诊疗工作的接口
 */
// 创建和更新诊疗工作
function createOrUpdateMedicalPractice (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/node/createOrUpdate', params)
}
// 删除诊疗工作
function deleteMedicalPractice (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/node/delete', params)
}
// 诊疗工作引用
function addMedicalPracticeByQuote (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/node/copyDetails', params)
}
/**
 * 以下是表单的相关接口
 */
// 表单引用
function addFormsByQuote (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/form/copyDetails', params)
}
// 表单查看
function formDetail (params) {
  return axios.post(baseurl + '')
}
// 表单删除
function deleteform (params) {
  return axios.post(baseurl + '')
}
/**
 * 以下是商品的相关接口
 */
// 引用中获取商品分类
function getGoodsCateByLevel (params) {
  return axios.get(baseurl + '/c-mall/doctor/category/getByParentId', { params: params })
}
// 引用中根据商品分类获取商品列表
function getGoodsList (params) {
  return axios.get(baseurl + '/c-mall/doctor/product/search', { params: params })
}
// 商品引用
function addGoodsByQuote (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/product/create', params)
}
// 修改商品信息
function updateGoods (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/product/updateTotalPriceDis', params)
}
// 删除商品信息
function deleteGoods (params) {
  return axios.post(baseurl + '/market/doctor/setmealdetail/product/delete', params)
}
// 获取使用有效期
function getValueByCode (params) {
  return axios.post('common/param/getValueByCode', params).then((response) => {
    return response
  })
}
function getApprovalCode () {
  return axios.post('common/param/getValueByCode', { code: 'market_approval' }).then((response) => {
    return response
  })
}
// 查询人员信息
function getStaffList (params) {
  return axios.post(baseurl + '/thc-platform-core/out/staff/getStaffListByCondition/', params).then((response) => {
    return response
  })
}
// 获取结构简称
function getClinicShorter (params) {
  return axios.post(baseurl + '/warehouse/clinicRecord/getClinicRecordList/', params)
}
// 修改套餐状态
function updateStatus (params) {
  return axios.post(baseurl + '/market/doctor/setmeal/updateStatus', params)
}
// 复制套餐
function createNewById (params) {
  return axios.post(baseurl + '/market/doctor/setmeal/CreateNewById', params)
}

// 获取医嘱项目列表
function searchForBrowser (params) {
  return axioss.post('/sob/service/searchForBrowser', params)
}
// 新建套餐优惠价
function createOrUpdateDiscount (params) {
  return axios.post(baseurl + '/market/doctor/setmealpreferential/createOrUpdate', params)
}
// 删除套餐优惠价
function delDiscount (params) {
  return axios.post(baseurl + '/market/doctor/setmealpreferential/delete', params)
}
// 修改套餐优惠价状态
function changeTypeDiscount (params) {
  return axios.post(baseurl + '/market/doctor/setmealpreferential/updateStatus', params)
}
// 删除套餐优惠价
function delTypeDiscount (params) {
  return axios.post(baseurl + '/market/doctor/setmealpreferential/delete', params)
}
// 创建套餐使用范围
function updateBatchRange (params) {
  return axios.post(baseurl + '/market/doctor/setMealRange/updateBatchRange/', params)
}
// 根据区域获取对应机构
function getClinicByCityCodeList (params) {
  return axioss.post('/thc-platform-core/out/organization/getOrgListByCondition/', params)
}
// 机构对某档案是否有创建权限
function getClinicManageConfigForRecord (params) {
  return axioss.post('/thc-platform-core/config/getClinicManageConfigForRecord/', params)
}

// 获取机构树结构
function getTreeNodesByClinicId (params) {
  return axioss.post('/thc-platform-core/out/organization/getOrgAndChildrenByCondition/', params)
}
// 保障计划二维码
function getQrCode (params) {
  return axios.post(baseurl + '/market/doctor/setmeal/getQrCode', params)
}

// 保障计划获取医生团队列表
function getDoctorTeamList () {
  return axios.post(baseurl + '/titan-cms/team/searchList')
}
// 修改保障计划订单项目内容
function updateOrderDetail (params) {
  return axios.post(baseurl + '/market/doctor/setmealOrder/updateOrderDetail', params)
}
// 删除
function delOrderDetail (params) {
  return axios.post(baseurl + '/market/doctor/setmealOrder/delOrderDetail', params)
}
export default {
  getStatusList,
  getClinicByCityCodeList,
  getPackageList,
  getPackageById,
  deletePackageById,
  getValueByCode,
  getDirectorysById,
  createOrUpdate,
  // createDirectory,
  // updateDirectory,
  createOrUpdateDirectory,
  deleteDirectory,
  createOrupdateMeal,
  deleteMealById,
  changeOrderNum,
  getDptsByOrgId,
  getClinicInfo,
  addMealDetailByQuote,
  updateTotalPriceDis,
  updateMoreTotalPriceDis,
  getDetailesById,
  createOrUpdateMedicalPractice,
  deleteMedicalPractice,
  addMedicalPracticeByQuote,
  addFormsByQuote,
  formDetail,
  deleteform,
  getGoodsCateByLevel,
  getGoodsList,
  addGoodsByQuote,
  updateGoods,
  deleteGoods,
  getStaffList,
  getApprovalCode,
  getClinicShorter,
  searchForBrowser,
  updateStatus,
  createNewById,
  createOrUpdateDiscount,
  delDiscount,
  changeTypeDiscount,
  updateBatchRange,
  delTypeDiscount,
  getClinicManageConfigForRecord,
  getTreeNodesByClinicId,
  getQrCode,
  getDoctorTeamList,
  updateOrderDetail,
  delOrderDetail
}
