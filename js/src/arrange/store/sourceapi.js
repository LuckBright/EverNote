import {arrange} from './api'
const url = 'arrange/'

function list (params) {
  return arrange.post(url + 'resource/search', params).then((response) => {
    return response
  })
}
// 创建资源
function create (params) {
  return arrange.post(url + 'resource/create', params).then((response) => {
    return response
  })
}
// 更新资源
function update (params) {
  return arrange.post(url + 'resource/update', params).then((response) => {
    return response
  })
}
// 删除
function deleteById (params) {
  return arrange.post(url + 'resource/delete', {id: params}).then((response) => {
    return response
  })
}

function getById (params) {
  return arrange.post(url + 'resource/getById', {id: params}).then((response) => {
    return response
  })
}
// 获取所有子资源类别
function getSubResourceType (params) {
  return arrange.post(url + 'resourceType/getSubResourceType', {id: params}).then((response) => {
    return response
  })
}
// 分诊台获取医生列表
function getArrangeResource (params) {
  return arrange.post(url + 'resourceArrange/getArrangeResource', params).then((response) => {
    return response
  })
}

export default {
  list,
  create,
  update,
  deleteById,
  getById,
  getSubResourceType,
  getArrangeResource
}
