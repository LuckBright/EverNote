import { warehouse as axios } from '../../../store/api'
const url = '/categoryMaterialRelation/'

// 药理分类未关联列表
async function list (params) {
  return await axios.post(url + 'getMaterialWithCategoryNotRelationList/', params)
}

// 药理分类已关联列表
function associationList (params) {
  return axios.post(url + 'getMaterialInCategoryList/', params).then(result => {
    return result
  })
}

// 创建关联关系
function updateOrCreate (params) {
  return axios.post(url + 'createCategoryMaterialRelation/', params).then(result => {
    return result
  })
}

// 解除关联关系
function del (id) {
  return axios.post(url + 'deleteCategoryMaterialRelation/', { id }).then(result => {
    return result
  })
}

// 药理分类未关联列表
function spuNotlist (params) {
  return axios.post(url + 'getMaterialSpuNotRelation/', params).then(result => {
    return result
  })
}

// 未关联关系创建
function notUpdateOrCreate (params) {
  return axios.post(url + 'createCategoryMaterialRelations/', params).then(result => {
    return result
  })
}

// 获取当前药理分类名称层级
function getPharmacologyCategoryById (id) {
  return axios.post('pharmacologyCategory/getPharmacologyCategoryById/', { id }).then(result => {
    return result
  })
}

export default {
  list,
  spuNotlist,
  associationList,
  updateOrCreate,
  notUpdateOrCreate,
  del,
  getPharmacologyCategoryById
}
