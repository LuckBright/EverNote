import rcm from './api'
const url = 'ar/refund/'
const flagUrl = 'ar/settlement/'
function formatResults (results) {
  var existRoorOrder = []
  let tmp = results.reduce(function (total, curr) {
    if (!total[curr.recipeId]) {
      total[curr.recipeId] = []
    }
    total[curr.recipeId].push(curr)
    return total
  }, {})

  for (let k in tmp) {
    let bill = tmp[k]
    if (bill[0] && existRoorOrder.indexOf(bill[0].rootorderid) === -1) {
      existRoorOrder.push(bill[0].rootorderid)
      bill[0].isNewRoot = true
    }
  }

  return tmp
}

function refundSettle (params) {
  return rcm
    .post(url + 'refundSettle', params)
    .then((response) => {
      // response.data.tableData =
      // formatResults(response.data.details.settlementDetail)
      response.data.tableData = formatResults(response.data.mergedSettleDetail)
      return response
    }, (response) => {
      return response
    })
}

function createMedicalRefund (params) {
  return rcm
    .post(url + 'createMedicalRefund', params)
    .then((response) => {
      return response
    }, (response) => {
      return response
    })
}

function getMedicalRefund (params) {
  return rcm
    .post(url + 'getMedicalRefund', params)
    .then((response) => {
      response.data.tableData = formatResults(response.data.details.settlementDetail)
      return response
    }, (response) => {
      return response
    })
}

function list (params) {
  return rcm
    .post(url + 'getRefundSettlement', params)
    .then((response) => {
      return response
    }, (response) => {
      return response
    })
}

function createRefund (id) {
  return rcm
    .post(url + 'createRefund', {settlementId: id})
    .then((response) => {
      return response
    }, (response) => {
      return response
    })
}

function getReceiptFlows (params) {
  return rcm.post(url + 'getReceiptFlows', params)
}

function startProcess (params) {
  return rcm
    .post(url + 'startProcess', params)
    .then((response) => {
      return response
    }, (response) => {
      return response
    })
}

function confirmRefund (params) {
  return rcm
    .post(url + 'confirmRefund', params)
    .then((response) => {
      return response
    }, (response) => {
      return response
    })
}
function updateSepcialRefundFlag (params) {
  return rcm
    .post(flagUrl + 'updateSepcialRefundFlag', params)
    .then((response) => {
      return response
    }, (response) => {
      return response
    })
}

export default {
  list,
  createRefund,
  startProcess,
  confirmRefund,
  refundSettle,
  getReceiptFlows,
  createMedicalRefund,
  updateSepcialRefundFlag,
  getMedicalRefund
}
