import {inpatient as axios} from './sobapi'
const url = ''
/**
 * 发送
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function sendAdvice (params) {
  return axios.post(url + 'medicalOrder/sendAdvice', params).then(result => {
    return result
  })
}
var tableData = [
  {
    a: '患者档案号',
    b: '住院号',
    c: '患者姓名',
    d: '性别',
    e: '年龄',
    f: '入院时间',
    g: '出院时间',
    h: '主诊断',
    i: '患者状态',
    j: '归档状态',
    k: '归档日期'
  }, {
    a: '患者档案号',
    b: '住院号',
    c: '患者姓名',
    d: '性别',
    e: '年龄',
    f: '入院时间',
    g: '出院时间',
    h: '主诊断',
    i: '患者状态',
    j: '归档状态',
    k: '归档日期'
  }, {
    a: '患者档案号333',
    b: '住院号',
    c: '患者姓名',
    d: '性别',
    e: '年龄',
    f: '入院时间',
    g: '出院时间',
    h: '主诊断',
    i: '患者状态',
    j: '归档状态',
    k: '归档日期'
  }
]

export default {
  sendAdvice,
  tableData
}
