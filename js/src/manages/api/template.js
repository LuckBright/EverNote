import { warehouse as axios } from '@/warehouse/store/api'
const url = 'basesource/'

function getSourceByTempletForCreateRecord (params) {
  return axios.post(url + 'getSourceByTempletForCreateRecord/', params)
}

function getSourceByMaterialDictForInClincForSY (params) {
  return axios.post(url + 'getSourceByMaterialDictForInClincForSY/', params)
}

function getSourceByMaterialDictInfoBySpuIdForSY (id, classifyId) {
  return axios.post(url + 'getSourceByMaterialDictInfoBySpuIdForSY/', { id, classifyId })
}

function getSourceByClassify (systemType) {
  return axios.post(url + 'getSourceByClassify/', { systemType })
}
// 同步组织变更数据
function doRelationDownTree (systemType) {
  return axios.post('architecture/doRelationDownTree/', { systemType })
}

export default {
  getSourceByTempletForCreateRecord,
  getSourceByMaterialDictForInClincForSY,
  getSourceByMaterialDictInfoBySpuIdForSY,
  getSourceByClassify,
  doRelationDownTree
}
