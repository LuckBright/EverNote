import { crm as axios, purl } from './api'

// 编号设置查询
function list (params) {
  return axios.get(purl + 'doctor/ruleConfig/search', {params: params})
    .then((rs) => {
      rs.totalCount = rs.data.totalCount
      return rs
    })
}
// 创建编号规则设置
function createOrUpdate (params) {
  var path = params.id ? 'modify' : 'create'
  return axios.post(purl + 'doctor/ruleConfig/' + path, params)
}
// 获取编码配置
function getByName () {
  return axios.get(purl + 'doctor/ruleConfig/getByNameAll')
    .then((rs) => {
      rs.totalCount = rs.data.totalCount
      return rs
    })
}
// 编号删除
function deleteId (params) {
  return axios.post(purl + 'doctor/ruleConfig/delete', params)
}
// 根据ID 查询
function getById (params) {
  return axios.post(purl + 'doctor/ruleConfig/getById', params)
}
// 获取流水号
function getSourceId (params) {
  return axios.get(purl + 'doctor/ruleConfig/getSerialNumberBySourceId', {params: params})
    .then((rs) => {
      return rs
    })
}
export default {
  list,
  createOrUpdate,
  getByName,
  deleteId,
  getById,
  getSourceId
}
