import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/rcm/med/medDeclare/'

function searchDeclareInfo (params) { // 查询申报记录
  return axios.post(url + 'searchDeclareInfo', params)
}

function declare (params) { // 申报
  return axios.post(url + 'declare', params)
}

function supDeclare (params) { // 补报
  return axios.post(url + 'supDeclare', params)
}

function searchSupDeclareInfo (params) { // 查询补报记录
  return axios.post(url + 'searchSupDeclareInfo', params)
}

function deleteDeclare (params) { // 删除申报
  return axios.post(url + 'deleteDeclare', params)
}

function confirmDeclare (params) { // 确认申报
  return axios.post(url + 'confirmDeclare', params)
}

function medicalCostMouthQuery (params) { // 查询补报月份
  return axios.post(url + 'medicalCostMouthQuery', params)
}

function medicalCostTips (params) { // 医疗费用申报类别提示
  return axios.post(url + 'medicalCostTips', params)
}

export default {
  declare,
  supDeclare,
  deleteDeclare,
  confirmDeclare,
  medicalCostTips,
  searchDeclareInfo,
  searchSupDeclareInfo,
  medicalCostMouthQuery
}
