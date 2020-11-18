import { warehouse as axios } from '../../../store/api'
const url = 'basesource/'
const materialSpuUrl = 'materialSpu/'
const materialSkuUrl = 'materialSku/'
const materialSectionUrl = 'materialSection/'

function getById (id, status, isClinic = false) {
  let urlupdeta = status === 'edit' ? 'getSourceByMaterialSpuInfoForSY/' : 'getSourceByMaterialInfoForSY/'
  return axios.post(url + urlupdeta, {
    id,
    isClinic
  })
}
function getthismaterialinfo (id, classifyId) {
  return axios.post(url + 'getSourceByMaterialDictInfoBySpuIdForSY/', {
    id,
    classifyId
  }).then(result => {
    return result
  })
}

// async function list (params) {
//   return await axios.post(url + 'getSourceByMaterialSkuListForSY/', params)
// }
async function list (params) {
  return await axios.post(materialSpuUrl + 'getMaterialSpuList/', params)
}
// spu启用禁用
function updateMaterialSpuMaster (params) {
  return axios.post(materialSpuUrl + 'updateMaterialSpuMaster/', params)
    .then((result) => {
      return result
    })
}
// sku启用禁用
function updateMaterialSkuMaster (params) {
  return axios.post(materialSkuUrl + 'updateMaterialSkuMaster/', params)
    .then((result) => {
      return result
    })
}
function skuUpdateOrCreate (params) {
  let urlSku = params.createOrUpdateId ? 'getSourceByUpdateMaterialSkuForSY/' : 'getSourceByCreateMaterialSkuForSY/'
  return axios.post(url + urlSku, params)
    .then((result) => {
      return result
    })
}
function spuUpdateOrCreate (params) {
  return axios.post(url + 'getSourceByUpdateMaterialSpuForSY/', params)
    .then((result) => {
      return result
    })
}

// function skuOrCreate (params) {
//   return axios.post(url + 'getSourceByCreateMaterialSkuForSY/', params)
//     .then((result) => {
//       return result
//     })
// }

// 集团查询物资列表(详情列表spu)
function spuList (params) {
  return axios.post(url + 'getMaterialSpuList/', params)
    .then((result) => {
      return result
    })
}

// 查询已添加的开单或执行科室
function getMaterialSectionVo (params) {
  return axios.post(materialSectionUrl + 'getMaterialSectionVo/', params)
    .then((result) => {
      return result
    })
}
// 机构添加 科室
function createMaterialSection (params) {
  return axios.post(materialSectionUrl + 'createMaterialSection/', params)
}
export default {
  getById,
  list,
  updateMaterialSpuMaster,
  updateMaterialSkuMaster,
  spuList,
  skuUpdateOrCreate,
  spuUpdateOrCreate,
  getthismaterialinfo,
  getMaterialSectionVo,
  createMaterialSection
  // skuOrCreate
}
