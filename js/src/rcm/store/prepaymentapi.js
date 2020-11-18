import axios from './api'
const url = 'ap/prePayment/'
import { diction } from '@/store/common'
const periodUrl = 'ap/apPeriodManage/'

let payStatus = [
  { id: '0', name: '新建' },
  { id: '1', name: '已支付' },
  { id: '2', name: '待审批' },
  { id: '3', name: '拒绝' },
  { id: '5', name: '取消' },
  { id: '6', name: '待支付' }
]

var schema = [
  // {
  //   name: 'clinicID',
  //   label: '机构名称',
  //   type: 'select',
  //   options: []
  // },
  {
    name: 'supplierID',
    label: '供应商名称',
    type: 'select',
    options: []
  },
  {
    startName: 'beginDate',
    endName: 'endDate',
    type: 'rangedate',
    label: '申请日期 自',
    outformat: 'yyyy-MM-dd'
  },
  {
    name: 'status',
    label: '预付款状态',
    type: 'select',
    options: payStatus
  },
  {
    name: 'supplierType',
    label: '供应商类型',
    type: 'systype',
    code: 'THC_WH_VENDOR_TYPE'
  },
  {
    name: 'paySum1',
    label: '预付款金额大于'
  },
  {
    name: 'paySum2',
    label: '预付款金额小于'
  },
  {
    name: 'illustration',
    label: '预付款说明'
  },
  {
    name: 'description',
    label: '业务详述'
  },
  {
    name: 'verifyStatus',
    label: '核销状态',
    type: 'select',
    options: [
      { id: 1, name: '未核销' },
      { id: 2, name: '部分核销' },
      { id: 3, name: '全部核销' }
    ]
  },
  {
    name: 'period',
    label: '财务期间',
    type: 'select',
    options: []
  },
  {
    name: 'agentID',
    label: '经办人',
    type: 'select',
    options: []
  }
]

function getPeriod () {
  return axios.post(periodUrl + 'getPeriodListByClinicId', {}).then(result => {
    return result.data
  })
}

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    result.data.payMethod = result.data.payMethod.toString()
    result.data.status = result.data.status.toString()
    result.data.paySum = result.data.paySum.toString()
    return result.data
  })
}
function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

function verify (id, isAgree) {
  return axios.post(url + 'verify/', {
    id: id,
    isAgree: isAgree
  })
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getList1/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getPreListForPay (params) {
  return axios.post(url + 'getPreListForPay/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getStaffList (params) {
  return axios.post(`${diction.api}/thc-platform-core/tsStaff/pageList`, params).then(response => {
    return response
  }, error => {
    console.log('error', error)
    return error
  })
}
export default {
  getById,
  createOrUpdate,
  del,
  list,
  getPeriod,
  verify,
  schema,
  getPreListForPay,
  getStaffList
}
