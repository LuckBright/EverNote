import { crm as axios } from './api'
import { diction } from '@/store/common'
const url = diction.api + '/rcm/er/'

// 根据患者查询报销方案（带分页）
function list (params) {
  return axios.post(url + 'reimburseProgramme/selectListByPatient/', params)
}

// 获取所有客户档案
function bigCustomerAll (params) {
  return axios.get(url + 'bigCustomer/getAll/', { params })
  .then((response) => {
    return response
  })
}

// 根据大客户id查询大客户下所有的报销方案
function selectByCustomer (params) {
  return axios.post(url + 'reimburseProgramme/selectByCustomer/', params)
}

// 报销方案添加患者
function addPatinets (params) {
  return axios.post(url + 'reimburseProgramme/addPatinets/', params)
}

// 解绑报销方案
function delPatinet (params) {
  return axios.post(url + 'reimburseProgramme/delPatinet/', params)
}

export default {
  list,
  bigCustomerAll,
  addPatinets,
  delPatinet,
  selectByCustomer
}
