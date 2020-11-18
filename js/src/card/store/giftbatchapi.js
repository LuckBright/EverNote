import { card as axios } from './api'
import { sob } from '@/sob/store/api'
const url = 'giftBatch/'

function getById (id) {
  return axios.get(url + 'getById', {
    params: {
      id: id
    }
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'modify' : 'create'
  return axios.post(url + path + '/', obj)
}

// 创建草稿
function apply (obj) {
  return axios.post(url + 'apply/', obj)
}
function modifyObj (obj) {
  return axios.post(url + 'modify/', obj)
}

function modifyCheck (obj) {
  return axios.post(url + 'modifyCheck/', obj)
}

function del (id) {
  return axios.get(url + 'delete', {
    params: {
      id: id
    }
  })
    .then((response) => {
      return response
    })
}

function list (params) {
  return axios.get(url + 'search', { params: params })
    .then((response) => {
      return response.data
    })
}

// 暂停
function pause (id) {
  var params = {
    id: id
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'pause', params)
    .then((response) => {
      return response
    })
}

// 结束
function stop (id) {
  var params = {
    id: id
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'stop', params)
    .then((response) => {
      return response
    })
}

// 发券
function send (params) {
  let param = axios.jsonToFormEncoded(params)
  return axios.post(url + 'send', param)
    .then((response) => {
      return response
    })
}

// 暂停/结束的反状态（叫继续吧）
function resume (id) {
  let params = {
    id: id
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'resume', params)
    .then((response) => {
      return response
    })
}

// 生成
function exportGift (params) {
  return axios.get(url + 'export', { params: params })
    .then((response) => {
      return response
    })
}
function modify (obj) {
  return axios.post(url + 'modifyServiceIds' + '/', obj)
}
function getCheckboxs () {
  return sob.post('/serviceprovider/getServiceProviderList/')
}
function modifyDptService (params) {
  return axios.post(url + 'modifyDptService', params)
}
export default {
  getById,
  createOrUpdate,
  del,
  list,
  pause,
  stop,
  send,
  resume,
  exportGift,
  modify,
  apply,
  modifyObj,
  modifyCheck,
  getCheckboxs,
  modifyDptService
}
