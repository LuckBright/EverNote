import {inpatient as axios} from '@/inpatient/store/sobapi'
const url = '/medical-record/doctor/'

// 病案管理列表查询
function recordManage (params) {
  return axios.post(url + 'recordManage/search', params).then(result => {
    return result
  })
}

// 病历归档
function recordManageLock (params) {
  return axios.post(url + 'recordManage/lock', params).then(result => {
    return result
  })
}
// 导出病案首页
function exportIndex (params) {
  return axios.post('/medical-record/doctor/exporter/export', params).then(result => {
    return result
  })
}
// 同步病案首页
function syncData (params) {
  return axios.post(url + 'recordManage/syncFee', params).then(result => {
    return result
  })
}
export default {
  exportIndex,
  recordManage,
  recordManageLock,
  syncData
}
