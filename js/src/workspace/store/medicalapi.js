import { workspace as axios } from './api'
const url = '/phr/'
const url1 = '/sob/'
const url2 = '/arrange/'
const url3 = '/phr/doctor/examineRecord/'
const url4 = '/phr/doctor/inspectRecord/'
const url5 = '/phr/doctor/dealRecord/'
const url6 = '/insurance/doctorAdvice/'
const url7 = '/phr-service/'
const urlExtend = '/platform-extend/'

function getInstanceList (params) {
  return axios.post('/medical-record/doctor/medicalRecord/getInstanceList', params)
}
function getOperationRecordHistroy (params) {
  return axios.post('/medical-record/doctor/medicalRecord/getOperationRecordHistory', params)
}
// 申请住院信息回显
function getByDoctorIdAndVisitNumber (data) {
  return axios({
    url: '/workbench/hospitalizedApplianceRecord/getByDoctorIdAndVisitNumber',
    method: 'post',
    data: data
  })
}

// 申请住院信息修改以后保存
function hospitalizedapplianceUpdate (data) {
  return axios({
    url: '/sob/hospitalizedApplianceRecord/create',
    method: 'post',
    data: data
  })
}

// 根据疾病获取部位
function getPosition (params) {
  return axios.post(urlExtend + 'disease/diseaseOrigPosition/getByDiseaseId', params)
}
// 检查/检验/治疗/耗材/其它接口调整
// const url2 = '/c-union/'today

function getExamhistory (params) {
  return axios.post(url3 + 'getLastPage', params)
}
function gethistory (params) {
  return axios.post(url4 + 'getLastPage', params)
}
function getdealHistory (params) {
  return axios.post(url5 + 'getLastPage', params)
}
function getHistoryRecord (params) {
  return axios.post(url1 + 'order/getHistoryRecord', params)
}
// const url2 = '/c-union/'today耗材和其他当天记录
function getOther (params) {
  return axios.post(url1 + 'order/getByVisitNumAndClassification', params)
}
function cancelOrder (params) {
  return axios.post(url1 + 'order/withdrawDeal', params)
}

/**
 * 根据订单获取中西药处方（包括药品批次信息）
 * @param params
 * params.orderId   订单id
 */
function getRecipeRecordByOrderId (params) {
  return axios.post(url1 + 'order/getRecipeRecordByOrderId', params).then(res => {
    if (res && res.data) {
      res.data.recipeItems = res.data.adviceItem
      return res.data
    } else {
      return null
    }
  })
}

function medicalEnd (taskId, params) {
  return axios.post('/process/task/finish', {
    processData: Object.assign({
      taskId: taskId
    }),
    businessData: params
  })
}
async function getServiceItem (params) {
  return await axios.cancelPost('/sob/service/queryServiceStandard', params)
}

async function searchForBrowser (params, key) {
  return await axios.cancelPost(`/sob/service/searchForBrowser${key ? ('?' + key) : ''}`, params)
}
async function searchForBrowserNoCancel (params) {
  return await axios.post('/sob/service/searchForBrowser', params)
}

async function getServiceBySweepCode (params) {
  return await axios.cancelPost('/sob/service/getServiceBySweepCode', params)
}

function getServiceByCode (params) {
  return axios.cancelPost('/sob/service/getByCode', params)
}

/**
 * 获取集团/机构医嘱项目列表
 * @param params
 * @returns {*}
 */
function queryService (params) {
  return axios.post('/sob/service/queryService/', params)
}

function queryServiceVariable (params) {
  return axios.post('/sob/service/queryServiceVariable', params)
}

function getServiceItemTemplate (params) {
  return axios.post('/sob/service/queryServiceTemplate', params)
}
function getDaijian (params) {
  return axios.post('/sob/service/getByCode', { code: params })
}
function getServiceItem1 (params) {
  params.offset = 0
  params.pagesize = 20
  return axios.post('/sob/service/queryServiceStandard', params).then(results => {
    let arr = results.data.map(v => {
      v.id = v.localMaterialId
      return v
    })
    return arr
  })
}
function getServiceSetAll (params) {
  return axios.post('/sob/service/getTenantServiceAndSet', params)
}
function getServiceSet (params) {
  return axios.post(url1 + 'serviceset/queryServiceSet', params)
}
function getServiceSetItem (params) {
  return axios.post('/sob/serviceset/getServSetItemList', params)
}
function getHistoryItem (params) {
  return axios.get(url + 'doctor/dealRecord/getHisPage', { params: params })
}
function saveMedicalItem (params) {
  return axios.post(url1 + 'order/createOrder', params)
}
function getMedicalRecord (params) {
  return axios.get(url + 'doctor/medicalRecord/getByVisitSn', { params: params })
}
// 保存病历数据
function savePatientCase (params) {
  let obj = {
    bodyCheck: params.bodyCheck,
    eyeCheck: params.eyeCheck,
    medicalRecord: params
  }
  delete params.bodyCheck
  delete params.eyeCheck
  return axios.post(url + 'doctor/medicalRecord/createBodyCheckAndMedicalRecord', obj)
}

// 获取疾病内容
function searchDiagnose (params) {
  return axios.get(urlExtend + 'disease/diseaseOrig/search', { params: params })
}

function getBodyCheck (params) {
  let suburl = 'getByVisitSn'
  if (params.patientId) {
    suburl = 'getLatestByPatientId'
  }
  return axios.get(url + 'doctor/bodyCheck/' + suburl, { params: params }).then(result => {
    if (result.data && Array.isArray(result.data)) {
      return result.data[0] || {}
    } else {
      return result.data || {}
    }
  })
}
function bodyCheckUpdate (params) {
  return axios.post(url + 'doctor/bodyCheck/createOrModify', params)
}
function addTemplate (params) {
  return axios.post(url7 + 'doctor/template/create', params)
}
function searchTemplate (params) {
  if (params.type) {
    params.type = Array.isArray(params.type) ? params.type : [params.type]
  }
  return axios.post(url7 + 'doctor/template/search', params)
}
function getTemplate (params) {
  return axios.get(url7 + 'doctor/template/getById', { params: params })
}
function delTemplate (params) {
  return axios.post(url7 + 'doctor/template/delete', axios.jsonToFormEncoded(params))
}
function getDrugList (key) {
  return axios.post('/warehouse/drug/getDrugList/', { name: key })
}
function checkDrugItem (data) {
  // return axios.post('/cdss-agent/doctor/medicineRule/checkOutpatientRecipe', data)
  return axios.post('/platform-extend/cdss-agent/medicineAllergy/checkOutpatientRecipe', data)
}
// 无人调用
// function submitDrugItem (params) {
//   return axios.post('/sob/order/createOrderZ', params)
// }
// 无人调用
// function queryStock (params) {
//   return axios.post('/sob/service/queryStock', params)
// }
// 无人调用   后端接口已废弃
// function queryStock1 (localMaterialId, visitNumber) {
//   // return axios.post('/sob/service/queryStockW', {localMaterialId, visitNumber})
//   return axios.post('/warehouse/stock/getStockInfoByStorageRooms/', { localMaterialId, visitNumber })
// }
// 查询单个service库房
function queryServiceStock (params) {
  // return axios.post('/sob/service/queryStockW', params).then(result => {
  return axios.post('/warehouse/stock/getStockInfoByStorageRooms/', params).then(result => {
    return result.data
  }).catch(() => false)
}
// 查询多个servuce库房
function queryMultiServiceStock (params) {
  return axios.post('/warehouse/stock/getStockInfoByStorageRoom/', params).then(result => {
    return result.data
  }).catch(() => false)
}
// 根据localMaterialId查询药品详细信息
function getDrugInfoByLocal (params) {
  return axios.post('/warehouse/localSetting/getSourceByLocalSettingListByIdsForService/', params)
}
function batchServiceStock (params) {
  return axios.post('/sob/service/queryServiceTemplateWithPrice', params).then(result => {
    return result.data
  })
}
function getDealRecord (visitSn) {
  return axios.get(url + 'doctor/dealRecord/getByVisitSn', {
    params: {
      visitSn
    }
  }).then(result => {
    return result.data
  }).catch(err => {
    console.log('--getInspectByVisitSn--', err)
  })
}
function getChiRecipeRecord (params) {
  return axios.get(url + 'doctor/chiRecipeRecord/getByVisitSn', { params: params })
}
function getDrugUnitName (unitId) {
  return axios.post('warehouse/unitGroupItem/getUnitGroupItemInfo/', {
    id: unitId
  })
}
function saveXiyao (params) {
  return axios.post(url + 'doctor/recipeRecord/createOrModify', params).then(results => {
    return results.data
  })
}
function getRecipeByVisitSn (params) {
  return axios.post(url1 + 'OrderController/getRecipesByVisitSn', params).then(result => {
    return result.data
  })
}
function getRecipeHistory (patientId, doctorId, dptId) {
  return axios.get(url + 'doctor/recipeRecord/getHisPage', {
    params: {
      patientId,
      doctorId,
      dptId
    }
  }).then(result => {
    if (!result.data.resultList) {
      return []
    }
    return result.data.resultList.reduce((total, curr) => {
      return [...total, ...curr.recipeItems]
    }, [])
  })
}
// 获取医嘱附加service信息
function handleServiceAddItems (params) {
  return axios.post('/sob/OrderController/handleServiceAddItems', params)
}
function createRecipeOrder (params) {
  return axios.cancelPost('/sob/OrderController/createRecipeInfo', params)
}
// 撤回医嘱
function removeRecipeOrder (params) {
  return axios.post('/sob/OrderController/removeRecipe', params)
}
// 取消医嘱
function cancleRecipe (params) {
  return axios.post('/sob/OrderController/cancleRecipe', params)
}
function getMedicalType (dptId) {
  return axios.get('/phr/doctor/medicalRecordStruct/getByOrigIdAndDptId', {
    params: {
      dptId
    }
  }).then(result => {
    return result
  })
}
// 无人调用
// function mergeGlobal (items, visitSn) {
//   let querys = items.map(item => {
//     return queryStock1(item.localMaterialId, visitSn).then(rs => {
//       if (item.totalAmount < rs.data.num) {
//         item.drugId = rs.data.globalMaterialId
//       }
//       return item
//     })
//   })
//   return Promise.all(querys).then(results => {
//     return results
//   })
// }
function getAppoint (visitNumber) {
  return axios.post(url2 + 'appoint/get', {
    visitNumber
  }).then(result => {
    return result.data
  })
}
/*
  * params (patientId)
  * 根据病人id获取既往病史等
*/
function getHistoryMedicalRecord (params) {
  return axios.get(url + 'doctor/medicalRecord/getLatestByPatientId', {
    params: params
  })
}
function getOrder (serviceClassification, patientId, visitNumber) {
  return axios.post('/sob/order/getByVisitNumAndClassification', {
    visitNumber,
    patientId,
    serviceClassification
  }).then(result => {
    let arr = result.data.map(v => {
      v.items = v.items.map(v1 => {
        v1.volume = v1.volume || v1.quantity
        v1.id = v1.serviceId
        return v1
      })
      return v
    })
    result.data = arr
    return result
  })
}
function getAppointInfo (visitNumber) {
  return axios.post('/sob/order/getAppointOrder', {
    visitNumber
  })
}
// 根据就诊号（visitNumber）查询挂号单
function getByVisitNumber (visitNumber) {
  return axios.post('/arrange/appointnum/getByVisitNumber', {
    visitNumber
  })
}
function getOrders (serviceClassification, visitNumber) {
  return axios.post('/sob/order/getByVisitNumAndClassification', {
    visitNumber,
    serviceClassification
  }).then(result => {
    let arr = result.data.map(v => {
      v.items = v.items.map(v1 => {
        v1.volume = v1.volume || v1.quantity
        v1.id = v1.serviceId
        return v1
      })
      return v
    })
    return arr
  })
}
function getInspectByVisitSn (visitSn) {
  return axios.get(url + 'doctor/inspectRecord/getByVisitSn', {
    params: {
      visitSn
    }
  }).then(result => {
    return result.data
  }).catch(err => {
    console.log('--getInspectByVisitSn--', err)
  })
}
function getExamByVisitSn (visitSn) {
  return axios.get(url + 'doctor/examineRecord/getByVisitSn', {
    params: {
      visitSn
    }
  }).then(result => {
    return result.data
  })
}
function getRecipeById (id) {
  return axios.post(url1 + 'OrderController/getRecipeByRecipeId', { id }).then(result => {
    let items = []
    if (result.data.adviceItem.length && ['303', '304'].indexOf(result.data.adviceItem[0].adviceType) > -1) {
      result.data.adviceItem.forEach(v => {
        let arr = JSON.parse(v.adviceContent)
        arr = arr.map(v1 => {
          Object.assign(v1, v1.serviceItem)
          v1.adviceName = v1.name
          return v1
        })
        items = items.concat(arr)
      })
      Object.assign(result.data, result.data.adviceItem[0])
      result.data.recipeItems = items
    } else {
      result.data.recipeItems = result.data.adviceItem
    }
    return result.data
  })
}
function getAdvicesByOrderId (params) {
  return axios.post(url1 + 'order/getAdvicesByOrderId', params).then(result => {
    let items = []
    if (result.data.adviceItem.length && ['303', '304'].indexOf(result.data.adviceItem[0].adviceType) > -1) {
      result.data.adviceItem.forEach(v => {
        let arr = JSON.parse(v.adviceContent)
        arr = arr.map(v1 => {
          Object.assign(v1, v1.serviceItem)
          v1.adviceName = v1.name
          return v1
        })
        items = items.concat(arr)
      })
      Object.assign(result.data, result.data.adviceItem[0])
      result.data.recipeItems = items
    } else {
      result.data.recipeItems = result.data.adviceItem
    }
    return result.data
  })
}

/**
 * 审方发药
 * @param id
 * @returns {Promise.<TResult>|*}
 */
function getRecipeByIdSpe (id) {
  return axios.post(url1 + 'OrderController/getRecipeByRecipeId', { id }).then(result => {
    result.data.recipeItems = result.data.adviceItem
    return result.data
  })
}

function getCHRecipeById (id) {
  return axios.get(url + 'doctor/chiRecipeRecord/getById', {
    params: {
      id
    }
  }).then(result => {
    return result.data
  })
}

function getServSetItemList (params) {
  return axios.post('/sob/serviceset/getServSetItemList', params)
}
function withdrawDrug (orderNo) {
  return axios.post('/sob/order/withdrawDrug', { orderBatchNo: orderNo })
}

function chineseLast (params) {
  return axios.post('/phr/doctor/chiRecipeRecord/getLastPage', params)
}

function westernLast (params) {
  return axios.post('/phr/doctor/recipeRecord/getLastPage', params)
}

// 查询入院申请
// function getApplianceByVisitNumber (params) {
//   return axios.post('/sob/hospitalizedappliance/getByVisitNumber', params)
// }

// 查询收住院申请
function getByPatientId (params) {
  return axios.post('/sob/hospitalizedappliance/getByPatientId', params)
}

// 获取住院次数
function admitNumberByPatientId (params) {
  return axios.post('/adt/doctor/admit/admitNumberByPatientId', params)
}
// 收住院更新基本信息
// function updateBaseInfo (params) {
//   return axios.post('/c-union/doctor/patient/append', params)
// }
function updateBaseInfo (params) {
  return axios.post('/c-union/doctor/patient/inpatientRegister', params)
}

/**
 * 医嘱信息共享-药品信息医嘱校验接口
 * @param params
 * @returns {*}
 */
function checkShareInfo (params) {
  return axios.post(url6 + 'drugCheck/getResult', params)
}

/**
 * 门诊开药预校验
 * @param params
 * @returns {*}
 */
function checkDrugInfo (params) {
  return axios.post('insurance/validate/prescribePreValidate', params)
}

/**
 * 医嘱信息共享-药品信息医嘱校验接口(批量药品）
 * @param params
 * @returns {*}
 */
function batchCheckShareInfo (params) {
  return axios.post('insurance/doctorAdvice/drugCheck/getResultForBatch', params)
}

/**
 * 门诊开药预校验(批量）
 * @param params
 * @returns {*}
 */
function batchCheckDrug (params) {
  return axios.post('insurance//validate/validateForBatch', params)
}

/**
 * 住院开立医嘱
 * @param params
 * @returns {*}
 */
function createAdvice (params) {
  return axios.post('/sob/medicalOrder/createAdvice', params)
}

/**
 * 查询排斥医嘱
 * @param params
 * @returns {*}
 */
function getExcludeAdvices (params) {
  return axios.post('/sob/medicalOrder/getExcludeAdvices', params)
}

/**
 * 根据患者id查询住院申请单
 * @param params
 * @returns {*}
 */
function existRecordByPatientId (params) {
  return axios.post('/adt/doctor/apply/existRecordByPatientId', params)
}
/**
 * 根据申请单id查询住院申请单
 * @param params
 * @returns {*}
 */
function applyGetById (params) {
  return axios.post('/adt/doctor/apply/getById', params)
}

/**
 * 获取医嘱退费列表
 * @param params
 * @returns {*}
 */
function getServiceOrderItemsByAdviceIds (params) {
  return axios.post(url1 + 'order/getServiceOrderItemsByAdviceIds', params)
}
/**
 * 获取执行单退费列表
 * @param params
 * @returns {*}
 */
function getServiceOrderItemsByExecuteIds (params) {
  return axios.post(url1 + 'order/getServiceOrderItemsByExecuteIds', params)
}
/**
 * 提交医嘱退费申请
 * @param params
 * @returns {*}
 */
function billPartRefund (params) {
  return axios.post(url1 + 'OrderController/billPartRefund', params)
}

/**
 * 提交医嘱退药申请
 * @param params
 * @returns {*}
 */
function applyRefund (params) {
  return axios.post(url1 + 'order/applyRefund', params)
}

/**
 * 获取门诊查询执行记录
 * @param params
 * @returns {*}
 */
function getDrugExcuteRecordsByRecipeId (params) {
  return axios.post(url1 + 'RecipeExcuteController/getDrugExcuteRecordsByRecipeId', params)
}

/**
 * 取消门诊执行记录
 * @param params
 * @returns {*}
 */
function cancleRecipeExcute (params) {
  return axios.post(url1 + 'outpatientExecute/cancel', params)
}

/**
 * 获取门诊查询退药记录
 * @param params
 * @returns {*}
 */
function getRefAdviceLogs (params) {
  return axios.post(url1 + 'refAdviceLog/getRefAdviceLogs', params)
}
/**
 * 根据id获取单条诊断数据记录
 * @param {*} params
 */
function getDiseaseById (params) {
  return axios.post('/platform-extend/disease/diseaseOrig/getById', params)
}
// 手术
function getOpration (params) {
  return axios.post('platform-extend/disease/surgical/search/', params)
}

// wh退药列表
function storageRoomBackStocks (params) {
  return axios.post('/warehouse/outpatientDispense/storageRoomBackStocks/', params)
}

function checkDiagnose (params) {
  return axios.post('/sob/recipe/checkDiagnose', params)
}

/**
 * 根据医嘱ID查询执行单ID
 * @param params
 * @returns {*}
 */
function getExecuteIdsByAdviceId (params) {
  return axios.post('/sob/doctorAdviceController/getExecuteIdsByAdviceId', params)
}

export default {
  getExecuteIdsByAdviceId,
  storageRoomBackStocks,
  getOpration,
  applyGetById,
  getOperationRecordHistroy,
  getInstanceList,
  queryService,
  queryServiceVariable,
  existRecordByPatientId,
  getServiceItem,
  searchForBrowser,
  searchForBrowserNoCancel,
  getServiceBySweepCode,
  getServiceByCode,
  getServiceItemTemplate,
  getServiceSetAll,
  getServiceSet,
  getServiceSetItem,
  getHistoryItem,
  saveMedicalItem,
  savePatientCase,
  getMedicalRecord,
  searchDiagnose,
  getBodyCheck,
  bodyCheckUpdate,
  addTemplate,
  searchTemplate,
  getTemplate,
  delTemplate,
  getDrugList,
  checkDrugItem,
  // submitDrugItem,
  // queryStock,
  batchServiceStock,
  medicalEnd,
  getDealRecord,
  getChiRecipeRecord,
  getDrugUnitName,
  saveXiyao,
  getRecipeByVisitSn,
  getRecipeHistory,
  // queryStock1,
  queryServiceStock,
  queryMultiServiceStock,
  getDrugInfoByLocal,
  getServiceItem1,
  getMedicalType,
  // mergeGlobal,
  getAppoint,
  getHistoryMedicalRecord,
  getOrder,
  handleServiceAddItems,
  createRecipeOrder,
  getAppointInfo,
  getByVisitNumber,
  getOrders,
  getInspectByVisitSn,
  getExamByVisitSn,
  getRecipeById,
  getRecipeByIdSpe,
  getAdvicesByOrderId,
  getCHRecipeById,
  getDaijian,
  getServSetItemList,
  getExamhistory,
  gethistory,
  withdrawDrug,
  westernLast,
  chineseLast,
  getOther,
  cancelOrder,
  getdealHistory,
  getHistoryRecord,
  admitNumberByPatientId,
  updateBaseInfo,
  getByPatientId,
  getRecipeRecordByOrderId,
  removeRecipeOrder,
  cancleRecipe,
  getPosition,
  checkShareInfo,
  checkDrugInfo,
  getByDoctorIdAndVisitNumber,
  hospitalizedapplianceUpdate,
  createAdvice,
  batchCheckShareInfo,
  batchCheckDrug,
  getExcludeAdvices,
  getServiceOrderItemsByAdviceIds,
  getServiceOrderItemsByExecuteIds,
  billPartRefund,
  applyRefund,
  getDrugExcuteRecordsByRecipeId,
  cancleRecipeExcute,
  getRefAdviceLogs,
  getDiseaseById,
  checkDiagnose
}
