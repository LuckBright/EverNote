import {sob as axios} from './api'

const url = '/decoctFees/'

// 煎法批量保存
function saveDecoctsBatch (params) {
  return axios.cancelPost(url + 'saveDecoctsBatch', params).then(res => {
    if (res && res.data) {
      return true
    }
    return false
  }).catch(() => {
    return false
  })
}

// 煎法查询列表
function getDecoctsList (params) {
  return axios.post(url + 'getDecoctsList', params).then(res => {
    if (res && res.data.length) {
      return {
        data: res.data,
        totalCount: res.totalCount
      }
    }
    return {
      data: [],
      totalCount: 0
    }
  }).catch(() => {
    return {
      data: [],
      totalCount: 0
    }
  })
}

// 更新保存煎法信息
function updateDecocts (params) {
  return axios.post(url + 'updateDecocts', params).then(res => {
    if (res && res.data) {
      return true
    }
    return false
  }).catch(() => {
    return false
  })
}

// 删除煎法
function deleteDecocts (params) {
  return axios.post(url + 'deleteDecocts', params).then(res => {
    if (res && res.data) {
      return true
    }
    return false
  }).catch(() => {
    return false
  })
}

// 根据code查询煎法费用
function getDecoctsAndPriceByCode (params) {
  return axios.post(url + 'getDecoctsAndPriceByCode', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return {}
  }).catch(() => {
    return {}
  })
}

// 查询物资列表
/**
 * @param {name: <String>, serviceClassificationList: <Array>}
 */
function queryService (params, key) {
  let url = '/service/queryService'
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
  saveDecoctsBatch,
  getDecoctsList,
  updateDecocts,
  deleteDecocts,
  getDecoctsAndPriceByCode,
  queryService
}
