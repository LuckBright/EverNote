import { getInstance } from '../api'

const axios = getInstance()
let url = '/titan-cms/'

// 新增文章
function created (params) {
  return axios.post(url + 'article/create', params)
}

// 查询文章详情接口
function getById (id) {
  return axios.get(url + 'article/getById?id=' + id)
}

// 文章列表
function list (params) {
  return axios.post(url + 'article/list', params)
}

// 删除列表
function remove (params) {
  return axios.post(url + 'article/remove', params)
}

// 文章搜索
function search (params) {
  return axios.post(url + 'article/search', params)
}

// 文章更新
function update (params) {
  return axios.post(url + 'article/update', params)
}

// 发布或者取消
function updateStatus (params) {
  return axios.post(url + 'article/updateStatus', params)
}

// 是否推荐到首页
function recommend (params) {
  return axios.post(url + 'article/recommend', params)
}
export default {
  created,
  getById,
  list,
  remove,
  search,
  update,
  updateStatus,
  recommend
}
