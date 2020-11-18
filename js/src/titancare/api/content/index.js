import { getInstance } from '../api'

const axios = getInstance()
let url = '/titan-video-cms/video/cms/'

// 获得店铺token  不需要id
function list (params) {
  return axios.get('/titan-mall/manage/shop/list', params)
}

// 推荐商品列表
function recommendList (params) {
  return axios.post('/titan-mall/third/spu/recommendList', params.data)
}

// 视频列表
function query (params) {
  return axios.post(url + 'query', params)
}

// 修改
function modified (params) {
  return axios.post(url + 'modified', params)
}

// 视频详情
function getVideo (id) {
  return axios.get(`${url}getVideo/${id}`)
}

// 日志列表
function queryOperationById (id) {
  return axios.get(`${url}queryOperationById/${id}`)
}
function shopDomain () {
  return axios.get('titan-mall/manage/shop/domain')
}

export default {
  list,
  recommendList,
  query,
  modified,
  getVideo,
  queryOperationById,
  shopDomain
}
