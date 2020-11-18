// 集团架构api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'architecture/'
// 创建（选择 / 编辑）集团机构
function create (clinicId) {
  return axios.post(url + 'addBlocClinicArchitecture/', { clinicId })
    .then((response) => {
      return response
    })
}
function createCustom (params) {
  return axios.post(url + 'addCustomDirectory/', params)
    .then((response) => {
      return response
    })
}
// 添加节点
function addNode (params) {
  return axios.post(url + 'addArchitecture/', params)
    .then((response) => {
      return response
    })
}
// 解除关系
function unbindNode (id) {
  return axios.post(url + 'unbindArchitecture/', { id })
    .then((response) => {
      return response
    })
}
// 获取机构列表
function mechanismList (type) {
  return axios.post(url + 'getClinicListForArchitecture/', {
    architectureType: type
  })
    .then((response) => {
      return response
    })
}
// 获取架构节点树
function treeList (id) {
  return axios.post(url + 'getBlocClinicArchitectureList/', { id })
    .then((response) => {
      return response
    })
}
// 重构机构树接口 2019-07-09
function getTreeList () {
  return axios.post(url + 'getBlocClinicArchitectureListNew/')
}
function updateTreeList (params) {
  return axios.post(url + 'updateBlocClinicArchitectureListNew/', params)
}
function getNodeObject (params) {
  return axios.post(url + 'getArchitectureInfo/', params)
    .then((response) => {
      return response
    })
}
async function list (params) {
  return await axios.post(url + 'getCustomDirectoryList/', params)
}
function getCustomById (params) {
  return axios.post(url + 'getCustomArchitectureList/', params)
    .then((response) => {
      return response
    })
}
// 获取自定义机构部门&集团发药库房
function getClinicDepartment (params) {
  return axios.post(url + 'getClinicListForCustom/', params)
    .then((response) => {
      return response
    })
}
// 获取集团发药物资
function getClinicMaterial (params) {
  return axios.post(url + 'getLocalSettingListForPllsClinic/', params)
    .then((response) => {
      return response
    })
}
function getClinicList (params) {
  return axios.post(url + 'getClinicListForPlls/', params)
    .then((response) => {
      return response
    })
}
function addCustomNode (params) {
  return axios.post(url + 'addCustomArchitecture/', params)
    .then((response) => {
      return response
    })
}
// 获取集团架构已解除列表
function getRelieveList (id) {
  return axios.post(url + 'getBlocIfUnbindArchitectureList/', { id })
    .then((response) => {
      return response
    })
}
// 获取自定义架构已解除列表
function getCustomRelieveList (params) {
  return axios.post(url + 'getCustomIfUnbindArchitectureList/', params)
    .then((response) => {
      return response
    })
}
export default {
  create,
  mechanismList,
  treeList,
  addNode,
  unbindNode,
  getNodeObject,
  list,
  createCustom,
  getCustomById,
  getClinicDepartment,
  addCustomNode,
  getRelieveList,
  getCustomRelieveList,
  getClinicMaterial,
  getClinicList,
  getTreeList,
  updateTreeList
}
