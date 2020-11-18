import {sob as axios} from './api'
const url = 'mergeInfo/'

function list (params) {
  return axios.post(url + 'getMergeInfos', params)
    .then((response) => {
      return response
    })
}

function createOrUpdate (obj) {
  let path = obj.id ? 'updateMergeDetailInfo' : 'updateMergeDetailInfo'
  return axios.post(url + path + '/', obj)
}

function getById (id) {
  return axios.post(url + 'getMergeDetailDtoById', {id})
    .then(result => {
      if (result && result.data) {
        result.data.isValid = '' + result.data.isValid
        result.data.isMerge = '' + result.data.isMerge
        return result.data
      } else {
        return {}
      }
    })
}

function del (id) {
  return axios.post(url + 'deleteMergeInfo/', {id})
}

// 查询医嘱和组套列表
/**
 * @param {}
 */
function getTenantServiceAndSet (params, key) {
  let url = '/service/getTenantServiceAndSet'
  if (key) {
    url = url + '?' + key
  }
  return axios.cancelPost(url, params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return []
  }).catch(() => {
    return []
  })
}

export default {
  list,
  createOrUpdate,
  getById,
  del,
  getTenantServiceAndSet
}
