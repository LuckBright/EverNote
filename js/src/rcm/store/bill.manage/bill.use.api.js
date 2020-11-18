import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/rcm/bill/'

// 使用列表
function listUse (params) {
  return axios.post(url + 'define/getDefineListUseInfo', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查询当前票据各批次剩余可用库存量
function getBatchUsableInfo (params) {
  return axios.post(url + 'userRealStore/getBatchUsableInfo', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查询本机构当前批次下可用库存票号
function getBillCodeByBatchId (params) {
  return axios.post(url + 'userRealStore/getBillCodeByBatchId', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 退回
function byDefineId (params) {
  return axios.post(url + 'giveBack/byDefineId', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 使用详情列表分页查询
function getUsedPage (params) {
  return axios.post(url + 'bill/getUsedPage', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 票据作废
function cancleById (params) {
  return axios.post(url + 'bill/cancleById', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  listUse,
  byDefineId,
  cancleById,
  getUsedPage,
  getBatchUsableInfo,
  getBillCodeByBatchId
}
