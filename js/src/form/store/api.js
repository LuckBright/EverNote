import axios from '@/util/http'
import {diction} from '@/store/common'
const url = diction.api + '/form-engine/'
var formapi = axios.create({
  baseURL: url,
  withCredentials: true
})

formapi.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data
})

function getMetas (displayName) {
  return formapi.post('/metaElementWidget/getMetaElementWidgets/', {
    displayName
  }).then(result => {
    return result
  })
}

function getTpl (id) {
  return formapi.post('/FormTemplate/queryTemplateDetail/', {
    id
  }).then(result => {
    if (result.schema) {
      result.schema.templateId = result.templateId
      result.schema.designerId = result.designerId
      return result.schema
    } else {
      return result
    }
  })
}

function delTpl (id) {
  return formapi.post('/FormTemplate/delete/', {
    id
  })
}
function saveTpl (tpl) {
  let obj = JSON.parse(JSON.stringify(tpl))
  let designerId = obj.designerId
  let templateId = obj.templateId
  delete obj.designerId
  delete obj.templateId
  let params = {
    designerId: designerId,
    schema: obj
  }
  // params.templateId = '98f24787-ba85-4774-8865-a97930e19465'
  if (templateId) {
    params.templateId = templateId
  }
  return formapi.post('/FormTemplate/createTemplate/', params)
}

function getTpls (params) {
  return formapi.post('/FormTemplate/queryTemplate', params)
}

// 加载模版数据
function getById (id) {
  if (!id || id === '-1') return Promise.reject()
  return formapi.post('/formData/getFormDataById', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (tplId, data, id, env) {
  let params = {
    formTemplateId: tplId,
    data: data
  }
  if (id !== '-1') {
    params.id = id
  }
  Object.assign(params, env)
  return formapi.post('/formData/createOrUpdateFormData', params)
}

function getForms (params) {
  return formapi.post('/formData/getFormDatasByTemplateId', params)
}

function getMetaData (columns, patientId, visitId, visitType) {
  return formapi.post('/echo/getVisitData/', {
    items: columns,
    params: {
      patientId,
      visitId,
      visitType
    }
  }).then(result => {
    return result
  })
}

// 编辑器回显所有数据
function getAllEchoNameWithValue (params) {
  return formapi.post('/metaElementRichtext/getAllEchoNameWithValue', {params})
}

// 数据元下拉列表
function elementaryList (params) {
  return formapi.post(`/doctor/system/config/data/list`, params)
}

// 基本信息
function baseInfo (params) {
  return formapi.post(`/doctor/system/config/patientInfo/search`, params)
}
function addBase (params) {
  return formapi.post(`/doctor/system/config/patientInfo/add`, params)
}
function editBase (params) {
  return formapi.post(`/doctor/system/config/patientInfo/update`, params)
}
// 诊断信息
function diagnosis (params) {
  return formapi.post(`/doctor/system/config/diagnose/search`, params)
}
function addDiagnose (params) {
  return formapi.post(`/doctor/system/config/diagnose/add`, params)
}
function editDiagnose (params) {
  return formapi.post(`/doctor/system/config/diagnose/update`, params)
}
// 体征信息
function sign (params) {
  return formapi.post(`/doctor/system/config/sings/search`, params)
}
function addSign (params) {
  return formapi.post(`/doctor/system/config/sings/add`, params)
}
function editSign (params) {
  return formapi.post(`/doctor/system/config/sings/update`, params)
}
// 其他信息
function other (params) {
  return formapi.post(`/doctor/system/config/other/search`, params)
}
function addOther (params) {
  return formapi.post(`/doctor/system/config/other/add`, params)
}
function editOther (params) {
  return formapi.post(`/doctor/system/config/other/update`, params)
}
// 眼科信息
function eye (params) {
  return formapi.post(`/doctor/system/config/yanke/search`, params)
}
function addEye (params) {
  return formapi.post(`/doctor/system/config/yanke/add`, params)
}
function editEye (params) {
  return formapi.post(`/doctor/system/config/yanke/update`, params)
}
// 评估信息
function assess (params) {
  return formapi.post(`/doctor/system/config/pinggu/search`, params)
}
function addAssess (params) {
  return formapi.post(`/doctor/system/config/pinggu/add`, params)
}
function editAssess (params) {
  return formapi.post(`/doctor/system/config/pinggu/update`, params)
}
// 评估信息
function operation (params) {
  return formapi.post(`/doctor/system/config/shoushu/search`, params)
}
function addOperation (params) {
  return formapi.post(`/doctor/system/config/shoushu/add`, params)
}
function editOperation (params) {
  return formapi.post(`/doctor/system/config/shoushu/update`, params)
}
// 段落信息
function paragraph (params) {
  return formapi.post(`/doctor/system/config/paragraph/search`, params)
}
function addParagraph (params) {
  return formapi.post(`/doctor/system/config/paragraph/add`, params)
}
function editParagraph (params) {
  return formapi.post(`/doctor/system/config/paragraph/update`, params)
}
function deleteOne (params) {
  return formapi.post(`/doctor/system/config/delete?id=${params.id}`)
}
function deleteMore (params) {
  return formapi.post(`/doctor/system/config/deletes?ids=${params.ids}`)
}

function initConfig (params) {
  return formapi.post(`/doctor/system/config/init`, params)
}

export default {
  baseInfo,
  addBase,
  editBase,
  diagnosis,
  addDiagnose,
  editDiagnose,
  sign,
  addSign,
  editSign,
  other,
  addOther,
  editOther,
  paragraph,
  addParagraph,
  editParagraph,
  deleteOne,
  deleteMore,
  initConfig,

  getMetas,
  getTpl,
  saveTpl,
  getById,
  createOrUpdate,
  getTpls,
  getForms,
  delTpl,
  getMetaData,
  getAllEchoNameWithValue,

  eye,
  addEye,
  editEye,
  assess,
  addAssess,
  editAssess,
  elementaryList,
  operation,
  addOperation,
  editOperation
}
