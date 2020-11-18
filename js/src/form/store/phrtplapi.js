import axios from '@/util/http'
import {diction} from '@/store/common'
import {warehouse as axios2} from '@/warehouse/store/api'
// import { Notification } from 'element-ui'
const url = diction.api + '/medical-record/doctor'
var phrtplapi = axios.create({
  baseURL: url,
  withCredentials: true
})

phrtplapi.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  } else {
    // Notification.success('操作成功')
  }
  return response.data.data
})
// 获取科室列表 (used)
function dptList () {
  var url = `/localSectionRecord/getLocalSectionVoListForService/`
  return axios2.post(url)
}

// // 获取树分类
// function getTreeData (params) {
//   return phrtplapi.post('/templateScopeCategory/search', params)
// }

// // 保存新建树
// function saveNewTree (params) {
//   return phrtplapi.post('/templateScopeCategory/createTree', params)
// }

// // 保存标签名
// function updateNodeName (params) {
//   return phrtplapi.post('/templateScopeCategory/update', params)
// }
// // 删除节点
// function deleteNode (params) {
//   return phrtplapi.post('/templateScopeCategory/delete', params)
// }

// // 添加标签
// function addNode (params) {
//   return phrtplapi.post('/templateScopeCategory/add', params)
// }
// 根据表单名查询表单 (used)
function getTemplateListByName (params) {
  return phrtplapi.post('/templateManage/getTemplateList', params)
}

// 创建模版数据(保存新建模版)
// function createTpl (params) {
//   return phrtplapi.post('/templateScope/create', params)
// }

// // 修改模版数据(修改已有模版数据)
// function updateTpl (params) {
//   return phrtplapi.post('/templateScope/update', params)
// }

// // 获取某个模版的分类信息
// function getTreeById (params) {
//   return phrtplapi.post('/templateScope/getCategoryById', params)
// }

export default{
  // getTreeData,
  // saveNewTree,
  // updateNodeName,
  // deleteNode,
  // addNode,
  getTemplateListByName,
  // createTpl,
  // getTreeById,
  // updateTpl,
  dptList
}
