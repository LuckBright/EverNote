import axios from '../api'

function list (params) {
  return axios.post('cashier/closeBill/getList1', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function exportList (params) {
  return axios.post('cashier/closeBill/exportCloseBill', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function mallList (params) {
  return axios.post('mall/close/getList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function mallExportList (params) {
  return axios.post('mall/close/exportCloseBill', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  list,
  exportList,
  mallList,
  mallExportList
}
