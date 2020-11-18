import { scheduled as axios } from './scheduledapi'

// 获取service下拉分类
function getSysTypeInfoList (params) {
  return axios.post('project/getSysTypeInfoList', params).then(result => {
    return result
  })
}
// 获取service下拉分类
function list (params) {
  return axios.post('project/queryService', params).then(result => {
    return result
  })
}
export default {
  getSysTypeInfoList,
  list
}
