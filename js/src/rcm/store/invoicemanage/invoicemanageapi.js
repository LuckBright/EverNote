
import rcm from '../api'
import axios from '@/insurance/store/api'
function list (params) { // 获取列表
  return rcm.post('/invoice/search', params)
}
function getInvData (params) { // 获取结算单详细信息
  return rcm.post('/invoice/getInvData', params)
}
function createInvoice (params) { // 新开发票，通过结算单信息获取发票号
  return rcm.post('http://127.0.0.1:1234/goldenTax/createInvoice', params)
}
function save (params) { // 保存发表信息
  return rcm.post('invoice/save', params)
}
function printInvoice (params) { // 发票打印
  return rcm.post('http://127.0.0.1:1234/goldenTax/printInvoice', params)
}
function updatePrintStatus (params) { // 修改发票打印状态
  return rcm.post('/invoice/updatePrintStatus', params)
}
function cancelInvoice (params) { // 作废发票
  return rcm.post('http://127.0.0.1:1234/goldenTax/cancelInvoice', params)
}
function invalidInvoice (params) { // 修改发票状态为已作废
  return rcm.post('/invoice/invalidInvoice', params)
}
function findInvoiceByIds (params) { // 根据结算单id查询发票信息
  return rcm.post('/invoice/findInvoiceByIds', params)
}
function getStaffList (params) { // 获取收费员列表
  return axios.post('/warehouse/staff/getStaffList/', params).then((response) => {
    return response
  })
}
function searchSettlement (params) { // 地税列表
  return rcm.post('/taxLocal/searchSettlement', params)
}
function settlementPrinted (params) { // 查询结算单是否已经打印
  return rcm.post('/taxLocal/settlementPrinted', params)
}
function exportSettlement (params) { // 导出列表
  return rcm.post('/taxLocal/exportSettlement', params)
}
function getDetails (params) { // 获取数据明细
  return rcm.post('/taxLocal/getDetails', params)
}
function printSave (params) {
  return rcm.post('/taxLocal/save', params)
}
function getValueByCode () {
  return axios.post('rcm/common/param/getValueByCode', {code: 'tax_enable'}).then((result) => {
    return result.data
  })
}
function getStaffClinicList (params) { // 获取机构列表
  return axios.post('/warehouse/staffClinic/getStaffClinicList/', params)
}
function saveInvoice (params) { // 手动输入发票的保存
  return rcm.post('/invoice/saveInvoice', params)
}
function printByTemplate (params) { // 查看即将要打印的票据号
  return rcm.post('/bill/userOutRecord/printByTemplate', params)
}
export default {
  list,
  save,
  printSave,
  getDetails,
  getInvData,
  saveInvoice,
  printInvoice,
  getStaffList,
  createInvoice,
  cancelInvoice,
  invalidInvoice,
  getValueByCode,
  printByTemplate,
  exportSettlement,
  searchSettlement,
  findInvoiceByIds,
  settlementPrinted,
  updatePrintStatus,
  getStaffClinicList
}
