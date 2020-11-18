import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api + '/medical-record/doctor'
const url2 = diction.api
var phrapi = axios.create({
  baseURL: url,
  withCredentials: true
})
var phrapi2 = axios.create({
  baseURL: url2,
  withCredentials: true
})

phrapi.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data
})
phrapi2.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data
})
// 支持数据填充
// 获取表单回显数据 getFormData和getById接口取得的结果一样，只是需要的参数不一样
// id 为 -1 代表不需要获取visitId关联的数据，需要做数据填充
function getFormData (params) {
  return phrapi.post(url + '/medicalRecord/getFormData', params)
}
// 表单实例加载数据接口
function getByRecordId4FormData (id) {
  return phrapi.get(url + '/medicalRecord/getByRecordId4FormData', {
    params: {
      id
    }
  })
}

// 根据表单schemaId直接获取
function getTpl (id) {
  return phrapi
    .post(url + '/medicalRecord/getTemplateById', {
      id
    })
    .then(result => {
      result.schema.templateId = result.templateId
      result.schema.designerId = result.designerId
      return result.schema
    })
}
// 1130兼容门诊改了phrform调的接口
function queryTemplateDetail (id) {
  return phrapi2.post('form-engine/FormTemplate/queryTemplateDetail', {id})
    .then(result => {
      return result.schema
    })
}

// 获取首次病程或入院记录的关联病历
// 先获取code判断是否二者之一，然后获取相关的病历
function getRelBingli ({ visitId, dptId, formTemplateId }) {
  return phrapi
    .post(url + '/templateManage/getByTemplateIdAndDptId', {
      formTemplateId,
      dptId
    })
    .then(result => {
      let code = result.code
      let code1 = null
      if (['SHOU_CI_BING_CHENG_JI_LU', 'RU_YUAN_JI_LU'].indexOf(code) > -1) {
        if (code === 'SHOU_CI_BING_CHENG_JI_LU') {
          code1 = 'RU_YUAN_JI_LU'
        } else if (code === 'RU_YUAN_JI_LU') {
          code1 = 'SHOU_CI_BING_CHENG_JI_LU'
        }
      }
      if (code1) {
        return phrapi.post('/medicalRecord/getByCodeAndVisitId', {
          visitId,
          code: code1,
          dptId
        })
      } else {
        return Promise.resolve(null)
      }
    })
}

// 根据日期返显
function getByCodeAndVisitId (params) {
  return phrapi.post('/medicalRecord/getByCodeAndVisitId', params)
}

// 通过code模版编码和dptId部门id两个值确定唯一表单
function getTemplateByCode (code, dptId, visitId, patientId) {
  let params = {
    code,
    dptId
  }
  // visitId 门诊预检不同年龄使用的样式模版不一样，因此需要获取患者的年龄，则需要患者的标识
  if (visitId) {
    params.visitId = visitId
  }
  if (patientId) params.patientId = patientId
  return phrapi
    .post(url + '/templateManage/getTemplateByCode', params)
    .then(result => {
      if (!result || !result.schema) return null
      result.schema.formDataId = result.formDataId
      result.schema.name = result.name
      if (result.ruleData) result.schema.ruleData = result.ruleData
      return result.schema
    })
}

// 保存工作台接口
function createOrUpdate ({formTemplateId, data, env, code, templateScopeId, role, formTemplateName}) {
  let params = getFormParams(formTemplateId, data, env)
  params.code = code
  params.role = role
  params.visitType = data.visitType
  delete params.data.visitType
  params.templateScopeId = templateScopeId
  params.formTemplateName = formTemplateName
  // 表单元素出现规则逻辑处理
  if (params.data) {
    if (params.data.hasOwnProperty('patientInfo')) { delete params.data.patientInfo }
    if (params.data.hasOwnProperty('metaData')) delete params.data.metaData
  }
  return phrapi.post(url + '/medicalRecord/create', params)
}
// 创建修改日志
function createChangeLog (formTemplateId, data, env, code, role) {
  let params = getFormParams(formTemplateId, data, env)
  params.code = code
  params.role = role
  // 表单元素出现规则逻辑处理
  if (params.data) {
    if (params.data.hasOwnProperty('patientInfo')) { delete params.data.patientInfo }
    if (params.data.hasOwnProperty('metaData')) delete params.data.metaData
  }
  return phrapi.post(url + '/medicalRecordProcess/create', params)
}
// 检测是否能修改
function checkRecordProcess (params) {
  return phrapi.post(url + '/medicalRecordProcess/checkRecordProcess', params)
}
// 病案首页打印校验
function checkPrint (formTemplateId, data, env) {
  let params = getFormParams(formTemplateId, data, env)
  return phrapi.post(
    url + '/medicalRecord/validateMedicaRecordHomePage',
    params
  )
}

// 将传进来的参数合并成一个对象params
function getFormParams (formTemplateId, data, env) {
  data = Object.assign({}, data, env)
  let params = {
    formTemplateId,
    data: data
  }
  if (data.id) {
    params.id = data.id
  }
  if (data.recordTime) {
    params.recordTime = data.recordTime
  }
  return params
}

// 获取模版列表
function getTplDatas (params) {
  params = Object.assign({}, params)
  if (params.businessType) {
    params.businessType = Number(params.businessType)
  }
  // 旧的接口
  // return phrapi.post(url + '/templateScope/search', params).then(result => {
  //   return result
  // })
  // 新的接口
  return phrapi
    .post(url + '/templateScope/search4Template', params)
    .then(result => {
      return result
    })
}

// 获取表单schema
function getTpls (dptId) {
  return phrapi
    .post(url + '/templateScope/getAllTemplates', { dptId })
    .then(result => {
      return result
    })
}

function getTplDataById (id) {
  return phrapi.post(url + '/templateScope/getById', { id })
}

function delTplDataById (id) {
  return phrapi.post(url + '/templateScope/delete', { id })
}
// 电子病历左侧菜单新的接口
function getPhrMenu (params) {
  return phrapi.post(url + '/medicalRecord/getMedicalRecordInstance', params)
}
// 添加病历的校验
function addRecordValid (params) {
  return phrapi.post(url + '/medicalRecord/addRecordValid', params)
}

// 诊断接口
function getZhenduan (visitId) {
  return phrapi.post(url + '/medicalRecord/getDiaByVisitId', { visitId })
}
// 住院体征接口
function getTijian (visitId, dptId) {
  return phrapi
    .post(url + '/medicalRecord/getPatientSignHistory', { visitId, dptId })
    .then(result => {
      return result
    })
}

// 门诊体征接口
function getClinic (visitId, dptId) {
  return phrapi
    .post(url + '/medicalRecord/getOutPatientPatientSignHistory', {
      visitId,
      dptId
    })
    .then(result => {
      return result
    })
}

function del (id) {
  return phrapi.post(url + '/medicalRecord/delete', {
    id
  })
}

// 操作日志（修改记录）
function modRecord (params) {
  return phrapi.post(url + '/medicalRecord/getOperationRecordHistroy', params)
}
// 操作日志（删除记录）
function delRecord (params) {
  return phrapi.post(
    url + '/medicalRecord/getOperationDeleteRecordHistroy',
    params
  )
}

function getPrintContinueRecords (params) {
  return phrapi.post(url + '/medicalRecord/getPrintContinueRecords', params)
}

function getSmallTemplate (params) {
  return phrapi.post(url + '/templateScope/getSmallTemplate', params)
}
// 获取现病史等信息
function getByVisitIdAndMetaName (params) {
  return phrapi.post(url + '/echo/getByVisitIdAndMetaName', params)
}
// 获取审批记录
function queryCheck (params) {
  return phrapi.post(url + '/medicalRecordProcess/queryPage', params)
}
// 撤销审批
function cancelCheck (params) {
  return phrapi.post(url + '/medicalRecordProcess/cancel', params)
}
// 病历管理列表
function queryTodoAndDone (params) {
  return phrapi.post(url + '/medicalRecordProcess/queryTodoAndDone', params)
}
// 添加评论
function addProcessData (params) {
  return phrapi.post(url + '/medicalRecordProcess/addProcessData', params)
}
// 流程记录
function queryProcessHistory (params) {
  return phrapi.post(url + '/medicalRecordProcess/queryProcessHistory', params)
}
// 流程记录
function getProcessInfo (params) {
  return phrapi.post(url + '/medicalRecordProcess/getById', params)
}
// 流程记录
function queryTask (params) {
  return phrapi.post(url + '/medicalRecordProcess/queryTask', params)
}
// 审批
function finish (params) {
  return phrapi.post(url + '/medicalRecordProcess/process/finish', params)
}
// 保存文档
function storeDoc (params) {
  return phrapi.post(url + '/medicalRecord/create', params)
}

// 查询有效病历的总数
function searchCount (params) {
  return phrapi.post(url + '/medicalRecord/searchCount', params)
}

export default {
  storeDoc,
  getFormData,
  getTpl,
  createOrUpdate,
  getTplDatas,
  getTplDataById,
  delTplDataById,
  getTemplateByCode,
  getTpls,
  getFormParams,
  getZhenduan,
  getTijian,
  getByRecordId4FormData,
  del,
  modRecord,
  delRecord,
  getClinic,
  getPrintContinueRecords,
  getPhrMenu,
  checkPrint,
  addRecordValid,
  getRelBingli,
  getSmallTemplate,
  getByVisitIdAndMetaName,
  getByCodeAndVisitId,
  createChangeLog,
  checkRecordProcess,
  queryCheck,
  cancelCheck,
  queryTodoAndDone,
  addProcessData,
  queryProcessHistory,
  getProcessInfo,
  queryTask,
  finish,
  queryTemplateDetail,
  searchCount
}
