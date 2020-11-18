// 电子病历分类管理api
import axios from '@/util/http'
import { diction } from '@/store/common'
const url1 = diction.api + '/sob/medicalSkillCategory/'
// const url1 = 'http://192.168.250.36:20037/medical-skill/medicalSkillCategory/'
const url = diction.api + '/medical-record/doctor/'
var anamnesisApi = axios.create({
  baseURL: url,
  withCredentials: true
})
anamnesisApi.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data
})

anamnesisApi.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

// 病历模版查询
function list (params) {
  if (params && params.orgId && Array.isArray(params.orgId)) {
    params.orgId = params.orgId.slice(-1)[0]
  }
  return anamnesisApi
    .post(url1 + 'search/', params)
    .then(result => {
      return result
    })
}

// 创建分类+子表
function createOrUpdate (params) {
  let path = params.id ? 'update' : 'create'
  return anamnesisApi.post(url1 + path + '/', params).then(result => {
    return result
  })
}

// 创建分类标签
function createLabel (params) {
  return anamnesisApi
    .post(url1 + 'createLabel/', params)
    .then(result => {
      return result
    })
}

// 删除分类
function del (id) {
  return anamnesisApi
    .post(url1 + 'delete/', { id })
    .then(result => {
      return result
    })
}

// 根据id查询分组
function getById (params) {
  if (!params.orgId) delete params.orgId
  return anamnesisApi.get(url1 + 'getDetailById/', { params })
}

// 获取分类标签树
function getLabelTree () {
  return anamnesisApi.get(url1 + 'getLabelTree/', {})
}

// 获取带有业务的分类，用于前序文档
function getCategoryList () {
  return anamnesisApi.get(url1 + 'getCategoryList/', {})
}

// 移动分类向上移动
function medicalRecordCategoryUp (id) {
  return anamnesisApi.get(url1 + 'up/', { params: { id } })
}

// 移动分类向下移动
function medicalRecordCategoryDown (id) {
  return anamnesisApi.get(url1 + 'down/', {
    params: { id }
  })
}

// 病历类型管理 获取 table data
function bingli (params) {
  return anamnesisApi.post(url1 + 'getTree', params)
}
function searchFirst (params) {
  return anamnesisApi.post(url1 + 'search', params)
}
function delBingli (params) {
  return anamnesisApi.post(url1 + 'delete', params)
}
function delMoreBingli (params) {
  return anamnesisApi.post(url1 + 'batchDelete', params)
}
function editBingli (params) {
  return anamnesisApi.post(url1 + 'update', params)
}
function create (params) {
  return anamnesisApi.post(url1 + 'create', params)
}
function init (params) {
  return anamnesisApi.post(url1 + 'init', params)
}

export default {
  init,
  delMoreBingli,
  editBingli,
  delBingli,
  searchFirst,
  create,
  bingli,
  createOrUpdate,
  createLabel,
  list,
  getById,
  del,
  getLabelTree,
  getCategoryList,
  medicalRecordCategoryUp,
  medicalRecordCategoryDown,

}
