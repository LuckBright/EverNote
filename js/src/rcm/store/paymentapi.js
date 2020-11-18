import rcm from './api'
const url = 'ap/payment/'

let payStatus = {
  '0': '新建',
  '1': '关闭',
  '2': '待审批',
  '3': '拒绝',
  '5': '取消',
  '6': '待支付'
}

// let payMethod = {
//   '0': '会员卡',
//   '1': '现金',
//   '2': '银行转账',
//   '3': '微信',
//   '4': '支付宝',
//   '5': '支票',
//   '6': '汇款',
//   '7': '挂账'
// }
let payMethod = {
  '1': '现金',
  '2': '银行存款',
  '3': '支票'
}

let payType = {
  '1': '采购付款',
  '2': '预付款'
}

function getById (id) {
  return rcm.post(url + 'get', {
    id
  }).then(result => {
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return rcm.post(url + path, obj)
}

function del (id) {
  return rcm.post(url + 'delete', {
    id
  })
}

function list (params) {
  return rcm.post(url + 'getList1', params)
}

function verify (id) {
  return rcm.post(url + 'verify', {
    id,
    isAgree: 1
  })
}

function refuse (id) {
  return rcm.post(url + 'verify', {
    isAgree: 2,
    id
  })
}

function confirmPay (obj) {
  let params = {
    id: obj.id,
    payDate: obj.payDate,
    payMethod: obj.payMethod,
    bankName: obj.bankName,
    bankAccount: obj.bankAccount,
    payInvoiceType: obj.payType
  }

  return rcm.post(url + 'payImplement', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  payStatus,
  verify,
  refuse,
  confirmPay,
  payMethod,
  payType
}
