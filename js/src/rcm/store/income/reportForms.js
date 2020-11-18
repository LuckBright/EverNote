import axios from '../api'
import { sob } from '@/sob/store/api'
import { diction } from '@/store/common'
const url = diction.api
function list (params) {
  return axios.post('cashier/getPackageDailyDetails', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function listDetails (params) {
  return axios.post('cashier/getDailyDetails', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
/**
 * 汇总列表
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function summaryList (params) {
  return axios.post('cashier/closeBill/getFeeClassDept', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

/**
 * 日结列表
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function dailySettlementList (params) {
  return axios.post('cashier/closeBill/getList1', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function doctorList (params) {
  return sob.post('providerdoctor/getProviderDoctorList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function exportDailyDetails (params) {
  return axios.post('cashier/exportPackageDailyDetails', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getViewStatus (params) {
  return axios.post('ar/settlement/getViewStatus', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
// sob
function searchSourch () {
  return axios.get(url + '/c-union/doctor/memberChannel/search').then(response => {
    return response
  })
}
// 获取人员列表
function getStaffList (params) {
  return axios.post(url + '/warehouse/staff/getStaffList/', params)
}
export default {
  list,
  listDetails,
  doctorList,
  summaryList,
  dailySettlementList,
  exportDailyDetails,
  searchSourch,
  getViewStatus,
  getStaffList
}
