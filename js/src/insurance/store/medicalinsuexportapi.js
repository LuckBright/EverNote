import axios from '@/insurance/store/api'
const url = '/insurance/catalogManage/'
const clinicUrl = '/insurance/insuranceOrg/'
// 药品导出
function medicineExport (id) {
  return axios.post(url + 'medicineExport', {
    // insuranceOrgId: id
  }).then(result => {
    return result
  })
}
// 收费项与诊疗设施导出
function chargeItemsExport (id) {
  return axios.post(url + 'chargeItemsExport', {
    // insuranceOrgId: id
  }).then(result => {
    return result
  })
}
// 药品导入 bucketName key
function medicineImport (params) {
  return axios.post(url + 'medicineImport', params).then(result => {
    return result
  })
}
// 收费项与诊疗设施导入
function chargeItemsImport (params) {
  return axios.post(url + 'chargeItemsImport', params).then(result => {
    return result
  })
}

function getClinicInfo (params) {
  return axios.post(clinicUrl + 'getClinicInfo', params).then(result => {
    return result
  })
}

export default {
  medicineExport,
  chargeItemsExport,
  medicineImport,
  chargeItemsImport,
  getClinicInfo
}
