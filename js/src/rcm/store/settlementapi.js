import rcm from './api'
import { diction } from '@/store/common'
const baseUrl = diction.api
const url = 'ar/settlement/'
const billUrl = '/ar/accountbill'
const paramsUrl = 'cashier/parameter/' // 获取结算配置参数url

const payStatus = {
  '0': '未支付',
  '1': '部分支付',
  '2': '完成支付'
}
const levelObj = {
  1: '无自付',
  2: '部分自付',
  3: '全自付'
}
const feeType = {
  'com': 'isComInsurance',
  'med': 'isMedInsurance',
  'pub': 'isPublicFee',
  'own': 'isOwnFee'
}
function formatResults (results) {
  var existRoorOrder = []
  let tmp = results.reduce(function (total, curr) {
    if (!total[curr.recipeId + curr.recipeName]) {
      total[curr.recipeId + curr.recipeName] = []
    }
    total[curr.recipeId + curr.recipeName].push(curr)
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
function medicareSettlementPrint (id) {
  return rcm.post(url + 'medicareSettlementPrint', {
    id: id
  })
}
function getBillById (id) {
  return rcm.post(billUrl + 'getListByRootOrderId', {
    rootOrderId: id
  }).then(result => {
    var obj = result.data
    obj.tableData = formatResults(obj.mergedSettleDetail)
    obj.feeType = []
    for (let k in feeType) {
      if (obj[feeType[k]]) {
        obj.feeType.push(k)
      }
    }
    if (obj.status === 0) {
      obj.payStatusStr = '未支付'
    } else {
      if (obj.payStatus || obj.payStatus === 0) {
        obj.payStatusStr = payStatus['' + obj.payStatus]
      } else {
        obj.payStatusStr = '完成支付'
      }
    }
    return obj
  })
}
function getById (id) {
  return rcm.post(url + 'getPrint', {
    id: id
  }).then(result => {
    var obj = result.data
    obj.tableData = formatResults(obj.mergedSettleDetail)
    obj.feeType = []
    for (let k in feeType) {
      if (obj[feeType[k]]) {
        obj.feeType.push(k)
      }
    }
    if (obj.status === 0) {
      obj.payStatusStr = '未支付'
    } else {
      if (obj.payStatus || obj.payStatus === 0) {
        obj.payStatusStr = payStatus['' + obj.payStatus]
      } else {
        obj.payStatusStr = '完成支付'
      }
    }
    return obj
  })
}
// 获取结算单处方信息,项目退费时使用
export function getRecipesBySettlementId (params) {
  return rcm.post('ar/refund/getRecipesBySettlementId', params)
}

function postGetPrint (id) {
  return rcm.post(url + 'postGetPrint', {
    id: id
  }).then(result => {
    var obj = result.data
    obj.tableData = formatResults(obj.mergedSettleDetail)
    obj.feeType = []
    for (let k in feeType) {
      if (obj[feeType[k]]) {
        obj.feeType.push(k)
      }
    }
    if (obj.status === 0) {
      obj.payStatusStr = '未支付'
    } else {
      if (obj.payStatus || obj.payStatus === 0) {
        obj.payStatusStr = payStatus['' + obj.payStatus]
      } else {
        obj.payStatusStr = '完成支付'
      }
    }
    return obj
  })
}

// function addStatus (now, pre, obj) {
//   return now.map(v => {
//     v.patientid = obj.patientid
//     return v
//   })
// }

function create (obj) {
  return rcm.post(url + 'settleCreate/', obj)
}

function del (id) {
  return rcm.post(url + 'cancelReceivables/', {
    id: id
  })
}
function cancelPersonalSettle (id) {
  return rcm.post(url + 'cancelPersonalSettle/', {
    id: id
  })
}

function cancelReceivables (id) {
  return rcm.post(url + 'cancelReceivables/', {
    id: id
  })
}

function list (params) {
  if (params.settleDate && params.settleDate[0]) {
    params.settleStartDate = params.settleDate[0]
    params.settleEndDate = params.settleDate[1]
  }
  if (params.treatDate) {
    params.treatStartDate = params.treatDate[0]
    params.treatEndDate = params.treatDate[1]
  }
  if (!params.insurorgid) {
    delete params.insurorgid
  }
  delete params.settleDate
  delete params.treatDate
  return rcm.post(url + 'getList2', params).then((response) => {
    response.data.map(v => {
      if (v.status === 0) {
        v.payStatusStr = '未支付'
      } else {
        if (v.payStatus || v.payStatus === 0) {
          v.payStatusStr = payStatus['' + v.payStatus]
        } else {
          v.payStatusStr = '完成支付'
        }
      }
      v.ismedinsuranceStr = v.isMedInsurance ? '是' : '否'
      v.iscominsuranceStr = v.isComInsurance ? '是' : '否'
      return v
    })
    return response
  }, (response) => {
    return response
  })
}

function calculate (id) {
  return rcm.post(url + 'settle', {
    id
  }).then(result => {
    result.data.tableData = formatResults(result.data.mergedSettleDetail)
    return result
  })
}

function confirmPay (params) {
  return rcm.post(url + 'createReceivables', params)
}

function getMedDetails (id) {
  // return Promise.resolve(testjson)
  return rcm.post(url + 'getMedDetails', {
    id
  })
}

function exportSettlementsInfo (params) {
  return rcm.post(url + 'exportSettlementsInfo', params)
}
function getHelpMedDetails (params) {
  return rcm.post(url + 'getHelpMedDetails', params)
}
function getParams () { // 获取配置参数 目前用在结算商保结算明细优惠可不可更改 自费明细优惠可不可更改
  return rcm.post(paramsUrl + 'getAll', {})
}
function getCountOfHaiChuangInvoiceItem (params) {
  return rcm.post(url + 'getCountOfHaiChuangInvoiceItem', params)
}
// 获取人员列表
function getStaffList (params) {
  return rcm.post(baseUrl + '/warehouse/staff/getStaffList/', params)
}
// 导出文件
function exportFile (params) {
  return rcm.post(url + 'exportGetList2', params)
}
// 黑龙江医保机构收据重打
function hljMedicalPrintAgain (params) {
  return rcm.post(`${url}medicareSettlementrePrint`, params)
}
// 乐陵医保预结算数据查询
function medicalFee (params) {
  return rcm.post(`${url}medicalFee`, params)
}
export default {
  medicalFee,
  levelObj,
  getById,
  postGetPrint,
  del,
  list,
  payStatus,
  calculate,
  confirmPay,
  create,
  cancelReceivables,
  getMedDetails,
  medicareSettlementPrint,
  exportSettlementsInfo,
  getHelpMedDetails,
  cancelPersonalSettle,
  getParams,
  getBillById,
  getCountOfHaiChuangInvoiceItem,
  getStaffList,
  exportFile,
  hljMedicalPrintAgain
}
