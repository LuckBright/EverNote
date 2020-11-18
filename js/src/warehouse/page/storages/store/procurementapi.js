// 采购申请api
import { warehouse as axios } from '@/warehouse/store/api'
import { progress as proaxios } from './api-process'
const purUrl = 'purchaseApply/'
const focusUrl = 'purchaseSummary/'
const url = 'contract/'

// 预警跳转采购申请
function getListByWarning (params) {
  return axios.post(purUrl + 'getPurchaseApplyListByWarning/', params)
}

// 采购申请列表
async function list (params) {
  return await axios.post(purUrl + 'getPurchaseApplyList/', params)
}

// 采购申请单详情
function getPurchaseApplyInfo (params) {
  return axios.post(purUrl + 'getPurchaseApplyInfo/', params).then((response) => {
    return response
  })
}

// 生成采购申请单草稿
function createNewPurchaseApplyLog (params) {
  return axios.post(purUrl + 'createNewPurchaseApplyLog/', params).then((response) => {
    return response
  })
}

// 根据物资id查询供应商列表
function getSupplierLocalProductListByLocalSettingId (params) {
  return axios.post(purUrl + 'getSupplierLocalProductListByLocalSettingId/', params).then((response) => {
    return response
  })
}

// 提交采购申请单
function submitPurchaseApply (params) {
  return axios.post(purUrl + 'submitPurchaseApply/', params).then((response) => {
    return response
  })
}

// 更新采购申请单
function updatePurchaseApply (params) {
  return axios.post(purUrl + 'updatePurchaseApply/', params).then((response) => {
    return response
  })
}

// 取消申请单
function cancelPurchaseApplyById (params) {
  return axios.post(purUrl + 'cancelPurchaseApplyById/', params).then((response) => {
    return response
  })
}

// 采购人员创建申请单
function createPurchaseApply (params) {
  return axios.post(purUrl + 'createPurchaseApply/', params).then((response) => {
    return response
  })
}

// 获取审批数据
function getPurchaseApplyProcessInfo (params) {
  return axios.post(purUrl + 'getPurchaseApplyProcessInfo/', params).then((response) => {
    return response
  })
}

// 审批通过
function finish (params) {
  return proaxios.post('task/finish', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

// 审批驳回
function rollback (params) {
  return proaxios.post('task/rollback', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

// 导出申请单
function exportPurchaseApplyInfo (params) {
  return axios.post(purUrl + 'exportPurchaseApplyInfo/', params).then((response) => {
    return response
  })
}

// 导出采购单
function exportPurchaseApplyOfOrderList (params) {
  return axios.post(purUrl + 'exportPurchaseApplyOfOrderList/', params).then((response) => {
    return response
  })
}
// 集采导出采购单
function exportPurchaseOrderInfo (params) {
  return axios.post(focusUrl + 'exportPurchaseOrderInfo/', params).then((response) => {
    return response
  })
}
// 集采导出采购申请单
function focusExportPurchaseApplyInfo (params) {
  return axios.post(focusUrl + 'exportPurchaseApplyInfo/', params).then((response) => {
    return response
  })
}

// 新版采购申请通过审核&&驳回审核
function updateApplyStatus (params) {
  return axios.post(purUrl + 'updateApplyStatus/', params)
}

// 通过物资查询最后一次供应商和合同
function getLastPurchaseOrderInfo (params) {
  return axios.post(purUrl + 'getLastPurchaseOrderInfo/', params)
}

// 集中采购申请提交
function focusCreatePurchaseApply (params) {
  return axios.post(focusUrl + 'createPurchaseApply/', params).then((response) => {
    return response
  })
}
// 集中采购申请暂存提交
function focusUpdatePurchaseApply (params) {
  return axios.post(focusUrl + 'updatePurchaseApply/', params).then((response) => {
    return response
  })
}
// 集中采购申请单详情
function focusGetPurchaseApplyInfo (params) {
  return axios.post(focusUrl + 'getPurchaseApplyInfo/', params).then((response) => {
    return response
  })
}
// 集中采购汇总单详情
function querySummaryInfo (params) {
  return axios.post(focusUrl + 'querySummaryInfo/', params).then((response) => {
    return response
  })
}
// 集中采购完善汇总单详情
function submitSummary (params) {
  return axios.post(focusUrl + 'submitSummary/', params).then((response) => {
    return response
  })
}
// 集中采购申请列表
async function focusList (params) {
  return await axios.post(focusUrl + 'getPurchaseApplyList/', params)
}
// 集中采购申请列表
async function queryApplyListByCondition (params) {
  return await axios.post(focusUrl + 'queryApplyListByCondition/', params)
}
// 集中采购取消申请单
function focusCancelPurchaseApplyById (params) {
  return axios.post(focusUrl + 'cancelPurchaseApplyById/', params).then((response) => {
    return response
  })
}
// 集中采购申请通过审核&&驳回审核
function focusUpdateApplyStatus (params) {
  return axios.post(focusUrl + 'updateApplyStatus/', params)
}
// 集中采购汇总单创建
function summaryCreate (params) {
  return axios.post(focusUrl + 'create/', params)
}
// 根据物资id和合同查询价格
function queryContractListBySupplier (params) {
  return axios.post(url + 'queryContractListBySupplier/', params)
}

export default {
  list,
  getPurchaseApplyInfo,
  createNewPurchaseApplyLog,
  getSupplierLocalProductListByLocalSettingId,
  submitPurchaseApply,
  updatePurchaseApply,
  cancelPurchaseApplyById,
  createPurchaseApply,
  getPurchaseApplyProcessInfo,
  finish,
  rollback,
  exportPurchaseApplyInfo,
  exportPurchaseApplyOfOrderList,
  updateApplyStatus,
  getLastPurchaseOrderInfo,
  focusList,
  focusGetPurchaseApplyInfo,
  focusUpdatePurchaseApply,
  focusCreatePurchaseApply,
  focusCancelPurchaseApplyById,
  focusUpdateApplyStatus,
  exportPurchaseOrderInfo,
  focusExportPurchaseApplyInfo,
  querySummaryInfo,
  summaryCreate,
  submitSummary,
  queryApplyListByCondition,
  queryContractListBySupplier,
  getListByWarning
}
