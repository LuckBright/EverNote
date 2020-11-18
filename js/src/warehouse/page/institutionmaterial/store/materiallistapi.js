import { warehouse as axios } from '@/warehouse/store/api'
const url = '/basesource/'
const materialUrl = 'material/'

// 列表
async function list (params) {
  return await axios.post(materialUrl + 'tenantSkuList/', params)
}
// 启用禁用
function updateMaterialSpuMaster (params) {
  return axios.post(materialUrl + 'updateMaterialSpuMaster/', params)
    .then((result) => {
      return result
    })
}
function updateState (params) {
  return axios.post(url + 'getSourceByUpdateLocalSettingState/', params)
    .then((result) => {
      return result
    })
}
// 获取物资管理（批次）批次详情列表左边拉数据
function getLeftSkuInfo (params) {
  return axios.post(materialUrl + 'tenantSkuInfoList', params).then(res => {
    return res
  }).catch(() => {})
}

// 批量设置加成率
function bulkSetMark (params) {
  return axios.post(materialUrl + 'batchReDoMarkupPercentage', params)
}

export default {
  list,
  updateMaterialSpuMaster,
  updateState,
  getLeftSkuInfo,
  bulkSetMark
}
