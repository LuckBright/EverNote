// 电子病历分类管理api
import axios from '@/util/http'
import { diction } from '@/store/common'
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
    .post(url + 'medicalRecordCategory/search/', params)
    .then(result => {
      return result
    })
}

// 创建分类+子表
function createOrUpdate (params) {
  let path = params.id
    ? 'medicalRecordCategory/update'
    : 'medicalRecordCategory/create'
  return anamnesisApi.post(url + path + '/', params).then(result => {
    return result
  })
}

// 创建分类标签
function createLabel (params) {
  return anamnesisApi
    .post(url + 'medicalRecordCategory/createLabel/', params)
    .then(result => {
      return result
    })
}

// 删除分类
function del (id) {
  return anamnesisApi
    .post(url + 'medicalRecordCategory/delete/', { id })
    .then(result => {
      return result
    })
}

// 根据id查询分组
function getById (params) {
  if (!params.orgId) delete params.orgId
  return anamnesisApi.get(url + 'medicalRecordCategory/getDetailById/', { params })
}

// 获取分类标签树
function getLabelTree () {
  return anamnesisApi.get(url + 'medicalRecordCategory/getLabelTree/', {})
}

// 获取带有业务的分类，用于前序文档
function getCategoryList () {
  return anamnesisApi.get(url + 'medicalRecordCategory/getCategoryList/', {})
}

// 病历绑定表单id
function bindingFormTemplate (params) {
  return anamnesisApi
    .post(url + 'templateManage/bindingFormTemplate/', params)
    .then(result => {
      return result
    })
}

// 移动分类向上移动
function medicalRecordCategoryUp (id) {
  return anamnesisApi.get(url + 'medicalRecordCategory/up/', { params: { id } })
}

// 移动分类向下移动
function medicalRecordCategoryDown (id) {
  return anamnesisApi.get(url + 'medicalRecordCategory/down/', {
    params: { id }
  })
}

// 同步关联关系
function sync2ChildrenOrg (params) {
  try {
    return anamnesisApi.post(url + 'templateManage/sync2ChildrenOrg', params)
  } catch (err) {
    return false
  }
}

// 能否修改/删除关联关系
function canModify (query) {
  let params = anamnesisApi.jsonToFormEncoded(query)
  try {
    return anamnesisApi.get(url + 'templateManage/canModify', { params })
  } catch (err) {
    return false
  }
}

// 病历类型管理 获取 table data
function bingli (params) {
  return anamnesisApi.post(url + 'medicalRecordCategory/getTree', params)
}
function searchFirst (params) {
  return anamnesisApi.post(url + 'medicalRecordCategory/search', params)
}
function delBingli (params) {
  return anamnesisApi.post(url + 'medicalRecordCategory/delete', params)
}
function delMoreBingli (params) {
  return anamnesisApi.post(url + 'medicalRecordCategory/batchDelete', params)
}
function editBingli (params) {
  return anamnesisApi.post(url + 'medicalRecordCategory/update', params)
}
function create (params) {
  return anamnesisApi.post(url + 'medicalRecordCategory/create', params)
}
function init (params) {
  return anamnesisApi.post(url + 'medicalRecordCategory/init', params)
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
  bindingFormTemplate,
  medicalRecordCategoryUp,
  medicalRecordCategoryDown,
  sync2ChildrenOrg,
  canModify
}
