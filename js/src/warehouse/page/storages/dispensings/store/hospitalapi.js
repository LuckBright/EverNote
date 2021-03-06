import { warehouse as axios } from '@/warehouse/store/api'
const url = '/uddDispense/'
const dispenselogUrl = '/dispenselog/'
const backStocksUrl = '/backStocks/'
// 住院发药相关接口
// 左侧按时间查询病区列表
function getSpaceList (params) {
  return axios.post(url + 'getSpaceList/', params)
}

// 获取给药途径/执行时间
function getSearchForList (params) {
  return axios.post(url + 'getSearchForList/', params)
}

// 药包信息
function getUddDispenseInfo (params) {
  return axios.post(url + 'getUddDispenseInfo/', params)
}
// 打印单个药包
function updateUddStatus (id) {
  return axios.post(url + 'updateUddDispenseStatus/', { id })
}

// 右侧单个病区的患者列表
function getUddDispenseList (params) {
  return axios.post(url + 'getUddDispenseList/', params)
}
// 批量打印
function createUddPrint (params) {
  return axios.post(url + 'createUddDispensePrinting/', params)
}

// 查询异常  getUddDispenseByIds/
function getUddDispenseByIds (params) {
  return axios.post(url + 'getUddDispenseByIds/', params)
}
// 更新异常
function updateUddDispenseItemList (params) {
  return axios.post(url + 'updateUddDispenseItemList/', params)
}
// 药包列表查询
function getUddList (params) {
  return axios.post(url + 'getUddDispenseVoList/', params)
}
// 住院发药数据查询
function getUddDipsenseListBySearch (params) {
  return axios.post(url + 'getUddDipsenseListBySearch/', params)
}
// 药包明细列表查询
function getUddDetailList (params) {
  return axios.post(url + 'getUddDispenseList/', params)
}

// 取消异常
function updateUddDispense (params) {
  return axios.post(url + 'updateUddDispense/', params)
}

// 异常药包右侧
function getUddDipsenseAndItemList (params) {
  return axios.post(url + 'getUddDipsenseAndItemList/', params)
}

// 备药完成
function updateUddList (params) {
  return axios.post(url + 'updateUddDispenseList/', params)
}
// 发药(多个udd药包)
function updateEndUddList (params) {
  return axios.post(url + 'updateEndUddDispenseList/', params)
}
// 住院异常任务 左侧 按患者查询
function getListForIdentification (params) {
  return axios.post(url + 'getListForIdentification/', params)
}

// 发药(单个udd药包)
function updateEndUdd (params) {
  return axios.post(url + 'updateEndUddDispense/', params)
}
// 获取status
function getStatusList (params) {
  return axios.post(url + 'getUddDispenseStatusList/', params)
}
// 操作记录
function getDispenseLogForUdd (params) {
  return axios.post(dispenselogUrl + 'getDispenseLogForUdd/', params)
}
// 住院退药左侧列表
function getBackStocksSpaceList (params) {
  return axios.post(url + 'getBackStocksSpaceList/', params)
}
// 住院退右侧列表
function getBackStocksUddDispenseList (params) {
  return axios.post(url + 'getBackStocksUddDispenseList/', params)
}
// 确认退药或拒绝
function updateBackStocks (params) {
  return axios.post(backStocksUrl + 'updateBackStocks/', params)
}
// 重新生成药包
function regenerateUddDispense (params) {
  return axios.post(url + 'regenerateUddDispense/', params)
}
// 住院皮试结果查询
function getUddSkinTest (obj) {
  return axios.post(url + 'getUddSkinTest/', obj)
}
// 住院 单人操作 药包发药 左侧列表
async function getUddListForCoordinationByHospitalizedNum (params) {
  return axios.post(url + 'getUddListForCoordinationByHospitalizedNum/', params)
}
// 住院 单人操作 药包发药 右侧药包信息
function getUddListForCoordinationByVisitSn (params) {
  return axios.post(url + 'getUddListForCoordinationByVisitSn/', params)
}
// 住院 单人操作 药包发药 批量操作备药，发药药包
function updateUddStatusForCoordination (params) {
  return axios.post(url + 'updateUddStatusForCoordination/', params)
}
export default {
  getSearchForList,
  getUddDispenseInfo,
  getSpaceList,
  getUddDispenseList,
  getUddDipsenseAndItemList,
  createUddPrint,
  getUddDispenseByIds,
  updateUddDispenseItemList,
  updateUddDispense,
  getUddList,
  getUddDetailList,
  updateUddList,
  updateEndUddList,
  getStatusList,
  updateEndUdd,
  updateUddStatus,
  getDispenseLogForUdd,
  getBackStocksSpaceList,
  getBackStocksUddDispenseList,
  updateBackStocks,
  getUddDipsenseListBySearch,
  getListForIdentification,
  regenerateUddDispense,
  getUddSkinTest,
  getUddListForCoordinationByHospitalizedNum,
  getUddListForCoordinationByVisitSn,
  updateUddStatusForCoordination
}
