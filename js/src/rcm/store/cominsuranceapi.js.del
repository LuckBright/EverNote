import rcm from './api'
const url = 'ar/settlement/'

function list (params) {
  delete params.daterange
  return rcm.post(url + 'getSumListBypaitent', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function insuranceBillPrint (params) {
  if (!params.insurorgid) {
    delete params.insurorgid
  }
  return rcm.post(url + 'insuranceBillPrint', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getAllFees (params) {
  if (!params.insurorgid) {
    delete params.insurorgid
  }
  return rcm.post(url + 'getAllFees', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
// 导出文件
function exportFile (params) {
  return rcm.post(url + 'exportSumListBypaitent', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  list,
  getAllFees,
  insuranceBillPrint,
  exportFile
}
