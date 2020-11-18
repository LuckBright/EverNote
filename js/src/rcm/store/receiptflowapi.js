import rcm from './api'
const url = 'ar/receiptFlow/'

function list (settleId) {
  return rcm.post(url + 'getListBySettleId', {
    id: settleId
  })
}

function create (receiptflow) {
  return rcm.post(url + 'create', receiptflow).then(result => {
    return result
  })
}

function pendingOrderVerify (receiptflow) {
  return rcm.post(url + 'pendingOrderVerify', receiptflow).then(result => {
    return result
  })
}

function pendingOrderResults (receiptflow) {
  return rcm.post(url + 'pendingOrderResults', receiptflow).then(result => {
    return result
  })
}

function createVerify (receiptflow) {
  return rcm.post(url + 'createVerify', receiptflow).then(result => {
    return result
  })
}

function get (id) {
  return rcm.post(url + 'get', {
    id
  })
}

function del (id) {
  return rcm.post(url + 'delete', {
    id
  })
}

export default {
  list: list,
  create,
  get,
  del,
  pendingOrderVerify,
  createVerify,
  pendingOrderResults
}
