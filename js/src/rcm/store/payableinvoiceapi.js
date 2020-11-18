import axios from './api'
const url = 'ap/purInvoice/'
import {diction} from '@/store/common'
const clinicUrl = diction.api + '/warehouse/supplierLocal/'
const periodUrl = 'ap/apPeriodManage/'
const taskUrl = diction.api + '/process/task/'

var invoiceType = [
  {id: '0', name: '普票'},
  {id: '1', name: '专票'},
  {id: '2', name: '预付款发票'}
]

var payStatus = [
  {id: '0', name: '未支付'},
  {id: '1', name: '部分支付'},
  {id: '2', name: '已支付'}
]

var status = [
  {id: '0', name: '新建'},
  {id: '2', name: '审批中'},
  {id: '6', name: '审核通过'}
]

var statusJson = {
  '0': '新建',
  '2': '审批中',
  '6': '审核通过'
}

var basisDate = [
  {id: 1, name: '按发票日期计算'},
  {id: 2, name: '按录入日期计算'}
]

function getSupplierLocalByClinic () {
  return axios.post(clinicUrl + 'getSupplierLocalByClinic/', {}).then(result => {
    let clinicArr = []
    result.data.resultList.forEach(function (item) {
      let itemObj = {}
      itemObj = Object.assign({}, item.supplierObject)
      itemObj.id = item.id
      clinicArr.push(itemObj)
    })
    result.data.clinicArr = clinicArr
    return result.data
  })
}

function getPeriod () {
  return axios.post(periodUrl + 'getPeriodListByClinicId', {}).then(result => {
    return result.data
  })
}

function getByCode (code) {
  return axios.post(url + 'getInvoiceByCode', {
    code: code
  }).then(result => {
    result.data.status = result.data.status ? result.data.status.toString() : '0'
    result.data.invoiceType = result.data.invoiceType ? result.data.invoiceType.toString() : '0'
    result.data.payStatus = result.data.payStatus ? result.data.payStatus.toString() : '0'
    result.data.totalFee = result.data.totalFee ? result.data.totalFee.toString() : '0'
    result.data.taxRatio = result.data.taxRatio.toString()
    return result
  })
}
function createOrUpdate (obj) {
  var path = obj.code ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

function invoiceVerify (obj) {
  return axios.post(url + 'invoiceVerify/', obj).then(response => {
    return response
  })
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function getAcceptanceList (params) {
  return axios.post(url + 'getAcceptanceList/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function list (params) {
  return axios.post(url + 'getList1/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function finish (params) {
  return axios.post(taskUrl + 'finish', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
// 获取是否需要审批字段，通过该接口可以获取对应code的值
function getValueByCode (params) {
  return axios.post(diction.api + '/rcm/common/param/getValueByCode', params)
}
export default {
  getByCode,
  createOrUpdate,
  del,
  list,
  invoiceType,
  payStatus,
  status,
  getPeriod,
  invoiceVerify,
  getAcceptanceList,
  getSupplierLocalByClinic,
  basisDate,
  finish,
  statusJson,
  getValueByCode
}
