import { warehouse as axios } from '@/warehouse/store/api'
const url = 'contract/'
const downUrl = 'ContractMaterialsItem/'
const priceUrl = 'MaterialsAdjustPrice/'

function addCreate (params) { // 新增合同
  return axios.post(url + 'create/', params)
}

function queryList (params) { // 查看合同列表
  return axios.post(url + 'queryList/', params)
}

function updateContrct (params) { // 修改合同
  return axios.post(url + 'update/', params)
}

function getContractNo (params) { // 模糊查询合同编号
  return axios.post(url + 'getContractNo/', params)
}

function getById (params) { // 查看合同
  return axios.post(url + 'getById/', params)
}
function deleteContract (params) { // 删除合同
  return axios.post(url + 'delete/', params)
}

function downLoad () { // 下载导入模板
  return axios.post(url + 'download/', {})
}

function importItem (params) { // 物资导入
  return axios.post(downUrl + 'importItem/', params)
}

function priceList (params) { // 获取调价列表
  return axios.post(priceUrl + 'query', params)
}

function selectNoContract (params) { // 无合同物资列表
  return axios.post(downUrl + 'selectNoContract/', params)
}

export default {
  addCreate,
  queryList,
  updateContrct,
  getContractNo,
  getById,
  deleteContract,
  importItem,
  downLoad,
  priceList,
  selectNoContract
}
