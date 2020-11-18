import { inpatient as axios } from '@/inpatient/store/sobapi'
const url = '/medical-record/doctor/'

function list (params) {
  return axios.post(url + 'recordReqAudit/search', params).then(result => {
    return result
  })
}

function recordReqAuditRecall (params) {
  return axios.post(url + 'recordReqAudit/audit', params)
}

var tableData = [
  {
    id: 'test',
    patientSn: '患者档案号',
    medicalSn: '住院号',
    name: '患者姓名',
    sex: '性别',
    age: '年龄',
    admissionTime: '入院时间',
    dischargeTime: '出院时间',
    diagnosis: '主诊断',
    dptName: '患者科室',
    creatorDptName: '医生科室',
    firstLockTime: '首次归档日期',
    lockTwice: '1',
    creatorName: '申请召回医生',
    createTime: '申请召回日期',
    lockTwiceTime: '23',
    createComment: 'test',
    auditor: '1323e',
    auditComment: '内容',
    auditTime: 'shijian',
    auditStatus: '1'
  }
]
export default {
  recordReqAuditRecall,
  list,
  tableData
}
