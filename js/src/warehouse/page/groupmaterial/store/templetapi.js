import { warehouse as axios } from '@/warehouse/store/api'
const url = '/basesource/'
const materialUrl = '/materialSpu/'

async function list (params) {
  return await axios.post(url + 'getSourceByTempletListForSY/', params)
}

function create (params) {
  return axios.post(url + 'getSourceByCreateTempletForSY/', params)
}

function updateTempletProperty (params) {
  return axios.post(url + 'getSourceByUpdateTempletPropertyList/', params)
}

function infoSee (params) {
  return axios.post(url + 'getSourceByTempletForLookUp/', params)
}

function globalInfoSee (params) {
  return axios.post(url + 'getSourceByTempletDictForLookUpForSY/', params)
}

function info (params) {
  return axios.post(url + 'getSourceByTempletInfo/', params)
}

function propertyInfo (params) {
  return axios.post(url + 'getSourceByPropertyInfo/', params)
}

function updateTemplet (params) {
  return axios.post(url + 'getSourceByUpdateTemplet/', params)
}

function propertylist (params) {
  return axios.post(url + 'getSourceByPropertyList/', params)
}

function templetPropertyList (params) {
  return axios.post(url + 'getSourceByTempletPropertyList/', params)
}

function listblock (params) {
  return axios.post(url + 'getSourceByClassifyListByBlock/', params)
}

function queryDictModel (params) {
  return axios.post(url + 'getSourceByTempletForCreateRecord/', params)
}
function createOrUpdate (params) {
  let path = params.id ? `${materialUrl}updateMaterialSpu/` : `${url}getSourceByCreateMaterialForSY/`
  return axios.post(path, params)
}

function materialList (params) {
  return axios.post(url + 'getSourceByMaterialDictForInClincForSY/', params)
}
// 药理分类
function categoryList (params) {
  return axios.post('/pharmacologyCategory/getAllPharmacologyCategory/', params)
}
// 机构修改销售价格
function updateRcmPrice (params) {
  return axios.post('localSetting/updateRcmPrice/', params)
}
export default {
  list,
  materialList,
  updateRcmPrice,
  queryDictModel,
  globalInfoSee,
  infoSee,
  info,
  updateTemplet,
  propertylist,
  templetPropertyList,
  updateTempletProperty,
  propertyInfo,
  createOrUpdate,
  listblock,
  create,
  categoryList
}
