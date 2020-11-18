import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/rcm/bill/'

// 发放列表
function listIssue (params) {
  return axios.post(url + 'orgProvide/selectPage', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查询票据现有可发放库存和最大票号
function selectCountMaxCode (params) {
  return axios.post(url + 'orgRealStore/selectCountMaxCode', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 发放票据
function quickProvide (params) {
  return axios.post(url + 'orgProvide/quickProvide', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 手动输入票据号入库
function quickManualInStore (params) {
  return axios.post(url + 'orgProvide/quickManualInStore', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 收回
function byProvideId (params) {
  return axios.post(url + 'giveBack/byProvideId', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  listIssue,
  byProvideId,
  quickProvide,
  selectCountMaxCode,
  quickManualInStore
}
