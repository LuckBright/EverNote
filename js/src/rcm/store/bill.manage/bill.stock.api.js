import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/rcm/bill/'

// 新建票据
function createStock (params) {
  return axios.post(url + 'define/insertSelective', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 票据列表
function listStock (params) {
  return axios.post(url + 'define/selectPage', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查看票据详情
function detailStock (params) {
  return axios.post(url + 'define/selectById', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 更新票据
function updateStock (params) {
  return axios.post(url + 'define/update', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查询票据是否可删除
function removeStock (params) {
  return axios.get(url + 'define/removeable/' + params.id).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 删除票据
function delStock (params) {
  return axios.post(url + 'define/deleteById', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 获取业务列表
function getBusinessList () {
  return axios.post(url + 'template/getBusinessList').then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 打印模版分页查询
function getTemplatePage (params) {
  return axios.post(url + 'template/getTemplatePage', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 打印模版关联关系查询
function selectList (params) {
  return axios.post(url + 'template/selectList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 打印模版批量创建
function insertBatchSelective (params) {
  return axios.post(url + 'template/insertBatch', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查询当前票据各批次剩余可用库存量
function getBatchUsableInfo (params) {
  return axios.post(url + 'orgRealStore/getBatchUsableInfo', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查询本机构当前批次下可用库存票号
function getBillCodeByBatchId (params) {
  return axios.post(url + 'orgRealStore/getBillCodeByBatchId', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  delStock,
  listStock,
  selectList,
  removeStock,
  updateStock,
  createStock,
  detailStock,
  getTemplatePage,
  getBusinessList,
  getBatchUsableInfo,
  getBillCodeByBatchId,
  insertBatchSelective
}
