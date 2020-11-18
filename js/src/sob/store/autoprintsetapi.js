import { workspace as axios } from '@/workspace/store/api'
const url = '/sob/autoPrintConfig/'
const ruleUrl = '/sob/executePrintConfig/'

// 查询自动打印状态
function getIsValidByOrgId (params) {
  return axios.post(url + 'getByOrgAndCodes', params)
}

// 更新自动打印状态
function updateIsValidByOrgId (params) {
  return axios.post(url + 'updateByOrgIdAndCode', params)
}

// 住院护士打印
// 查询
function getConfigList (params) {
  return axios.post(ruleUrl + 'getConfigList', params)
}

// 添加
function addConfig (params) {
  return axios.post(ruleUrl + 'addConfig', params)
}

// 修改
function updateConfig (params) {
  return axios.post(ruleUrl + 'updateConfig', params)
}

// 删除
function deleteConfig (params) {
  return axios.post(ruleUrl + 'deleteConfig', params)
}

export default {
  getIsValidByOrgId,
  updateIsValidByOrgId,
  getConfigList,
  addConfig,
  updateConfig,
  deleteConfig
}
