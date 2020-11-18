import {inpatient as axios} from './sobapi'
const url = '/medical-record/doctor/'
/**
 * 住院医生工作台 病历管理
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function recordManage (params) {
  return axios.post(url + 'recordManage/search', params).then(result => {
    return result
  })
}

/**
 * 召回申请
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function recordReqAuditCreate (params) {
  return axios.post(url + 'recordReqAudit/create', params).then(result => {
    return result
  })
}

var tableData = [
  {
    id: 'testid',
    patientSn: '患者档案号111',
    medicalSn: '住院号',
    name: '患者姓名',
    sex: 2,
    age: 23,
    admissionTime: '入院时间',
    dischargeTime: '出院时间',
    diagnosis: '主诊断',
    patientStatus: '患者状态',
    opStatus: 0,
    lockTime: '归档日期',
    createTime: '11'
  }
]
export default {
  recordManage,
  tableData,
  recordReqAuditCreate
}
