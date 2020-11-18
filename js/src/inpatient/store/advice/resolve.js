import { inpatient as axios } from '../sobapi'
const url = '/sob/inpatientController/'

// 分解医嘱
function splitOutpatientExecutes (params) {
  return axios.post(url + 'splitOutpatientExecutes', params)
}

// 查询待提交分解医嘱列表
function queryPreSubmitSplit (params) {
  return axios.post(url + 'queryPreSubmitSplit', params)
}

// 删除执行单
function deleteSplitExecutes (params) {
  return axios.post(url + 'deleteSplitExecutes', params)
}

// 查询已分解医嘱列表
function querySplitedList (params) {
  return axios.post(url + 'querySplitedList', params)
}

// 批量提交
function submitExecutes (params) {
  return axios.post(url + 'submitExecutes', params)
}

// 领药
function submitMaterials (params) {
  return axios.post(url + 'submitMaterials', params)
}

// 取消领药
function cancelMaterials (params) {
  return axios.post(url + 'cancelMaterials', params)
}

// 退药
function returnMaterials (params) {
  return axios.post(url + 'returnMaterials', params)
}

// 坚持发药
function confirmMaterials (params) {
  return axios.post(url + 'confirmMaterials', params)
}

// 分解执行单记录
function querySplitedRecordList (params) {
  return axios.post(url + 'querySplitedRecordList', params).then(res => {
    if (res.list) {
      return {
        data: res.list,
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

export default {
  splitOutpatientExecutes,
  queryPreSubmitSplit,
  deleteSplitExecutes,
  querySplitedList,
  submitExecutes,
  submitMaterials,
  cancelMaterials,
  returnMaterials,
  confirmMaterials,
  querySplitedRecordList
}
