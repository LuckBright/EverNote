import {workspace as axios} from './api'
const url = 'c-union/doctor/'

// 查询社保信息
function getSocialInsur (params) {
  params = axios.jsonToFormEncoded(params)
  return axios.get(url + 'socialinsur/getByPatientId', {params: params})
}

// 查询商保信息
function getBusinessInsur (params) {
  params = axios.jsonToFormEncoded(params)
  return axios.get(url + 'busiInsur/getByPatientId', {params: params})
}

// 新增/更新 社保信息
function createOrModifySocialInsur (params) {
  var action = params.id ? 'modify' : 'create'
  return axios.post(url + 'socialinsur/' + action, params)
}

// 保存商保信息
function saveBusinessInsur (params) {
  return axios.post(url + 'busiInsur/createBatch', params)
}

// 删除商保信息
function delBusinessInsur (params) {
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'busiInsur/delete', params)
}
// 获取商保信息
function getInfo (params) {
  return axios.get(url + 'busiInsur/getById', {
    params: params
  })
}
// 添加或修改商保
function createOrmodify (params) {
  var action = params.id ? 'modify' : 'create'
  return axios.post(url + 'busiInsur/' + action, params)
}
export default {
  createOrModifySocialInsur,
  saveBusinessInsur,
  getSocialInsur,
  getBusinessInsur,
  delBusinessInsur,
  getInfo,
  createOrmodify
}
