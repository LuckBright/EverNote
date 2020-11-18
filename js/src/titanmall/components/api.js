import api from '@/titanmall/utils/api'

let axios = api.base
let url = api.url

// 店铺列表
function list () {
  return axios.get(url + 'manage/shop/list')
}

// 获取分组下拉列表
function groupListBySpuGroup (params) {
  return axios.post(url + 'manage/group/listBySpuGroup', params)
}

// 获取素材分组下拉列表
function groupListByMaterialGroupBox () {
  return axios.get(url + 'manage/group/listByMaterialGroupBox')
}

// 上传图片
function materialConfigUpload (params) {
  return axios.post(url + 'manage/materialConfig/upload', params)
}

// 获取素材分组列表
function groupListByMaterialGroup () {
  return axios.post(url + 'manage/group/listByMaterialGroup')
}

// 获取素材分组中的图片数据
function materialConfigList (params) {
  return axios.post(url + 'manage/materialConfig/list', params)
}

// 获取图片token
function authToken (params) {
  return axios.get('/api-ih/titan-cms/base/auth/token', params.config)
}

export default {
  list,
  groupListBySpuGroup,
  groupListByMaterialGroupBox,
  materialConfigUpload,
  groupListByMaterialGroup,
  materialConfigList,
  authToken,
}
