import { crm as axios, durl } from '@/crm/store/api'

// 分类管理 添加分类
function addClassify (params) {
  let action = params.id ? 'modify' : 'createMaterial'
  return axios.post(durl + '/thc-follow-up/doctor/category/' + action, params)
}
// 分类管理 获取分类
function getAllImageText (params) {
  return axios
    .get(durl + '/thc-follow-up/doctor/category/getAllMaterial', {
      params: params
    })
    .then(response => {
      return response
    })
}
// 分类管理 删除分类
function deleteClassify (params) {
  return axios.post(durl + '/thc-follow-up/doctor/category/delete', params)
}
// 分类管理 根据id查询分类信息
function getCategorydetail (params) {
  return axios.get(durl + '/thc-follow-up/doctor/category/getById', {
    params: params
  })
}
// 素材管理 获取分类
function getByCategory (params) {
  return axios.get(
    durl + '/thc-follow-up/doctor/material/getImageTextByCategory',
    {
      params: params
    }
  )
}
// 素材管理 添加图文
function createImg (params) {
  let action = params.id ? 'modify' : 'createImageText'
  return axios.post(durl + '/thc-follow-up/doctor/material/' + action, params)
}
// 素材管理 删除图文
function deleteImg (params) {
  return axios.post(durl + '/thc-follow-up/doctor/material/delete', params)
}
// 素材管理 查看详情
function getImgById (params) {
  return axios.get(durl + '/thc-follow-up/doctor/material/getById', {
    params: params
  })
}
// 随访计划 添加随访模版
function createModel (params) {
  let action = params.id ? 'modify ' : 'create'
  return axios.post(
    durl + '/thc-follow-up/doctor/followUpTemplate/' + action,
    params
  )
}
// 随访计划 查询疾病数据
function diseaseSearch (params) {
  return axios.get(durl + '/platform-extend/disease/diseaseOrig/search', {
    params: params
  })
}
// 随访计划 删除随访计划模版
function deleteModel (params) {
  return axios.post(
    durl + '/thc-follow-up/doctor/followUpTemplate/delete',
    params
  )
}
// 随访计划 条件搜索模版list
function list (params) {
  return axios
    .get(durl + '/thc-follow-up/doctor/followUpTemplate/search', {
      params: params
    })
    .then(response => {
      response.totalCount =
        response.data != null ? response.data.totalCount : 0
      return response
    })
}
// 随访计划 查询随访模版详情
function getByIdModel (params) {
  return axios.get(durl + '/thc-follow-up/doctor/followUpTemplate/getById', {
    params: params
  })
}
// 查询随访模版下的子任务
function getTemplatelist (params) {
  return axios.get(
    durl + '/thc-follow-up/doctor/followUpTemplateTask/getByTemplateId',
    {
      params: params
    }
  )
}
// 随访任务 添加随访子任务
function createTask (params, isCreate) {
  const method = isCreate ? 'create' : 'modify'
  return axios.post(
    `${durl}/thc-follow-up/doctor/followUpTemplateTask/${method}`,
    params
  )
}
// 随访任务 查询子任务详情
function getTaskDetail (params) {
  return axios.get(
    durl + '/thc-follow-up/doctor/followUpTemplateTask/getById',
    {
      params: params
    }
  )
}
// 随访任务 删除子任务
function deleteTask (params) {
  return axios.post(
    durl + '/thc-follow-up/doctor/followUpTemplateTask/delete',
    params
  )
}
// 随访管理 查询随访
function getAllfollowUp (params) {
  return axios
    .get(durl + '/thc-follow-up/doctor/followUp/search', {
      params: params
    })
    .then(response => {
      response.totalCount =
        response.data != null ? response.data.totalCount : 0
      return response
    })
}
// 新建随访
function createFollowUp (params) {
  return axios.post(
    durl + '/thc-follow-up/doctor/followUp/createBatch',
    params
  )
}
// 新建随访中 查询门诊患者list
function getPatientlist (params) {
  return axios.post(
    durl + '/phr/doctor/t02OutpatientVisit/v3.3/searchPageByDateAndProvider',
    params
  )
}
function getHospitalPatient (params) {
  return axios.post(
    durl + '/phr/doctor/t02InpatientVisit/v3.3/searchPageByDateAndProvider',
    params
  )
}
// 查询科室下所有人
function getStaff (params) {
  return axios.post(
    durl + '/warehouse/staffRecord/getStaffRecordVoListForService/',
    params
  )
}
// 终止随访
function stopFollow (params) {
  return axios.post(durl + '/thc-follow-up/doctor/followUp/terminate', params)
}
// 随访子任务列表 操作日志
function taskLog (params) {
  return axios.get(
    durl + '/thc-follow-up/doctor/followUpItem/getByFollowUpId',
    {
      params: params
    }
  )
}
// 随访管理 删除随访
function deleteFollowup (params) {
  return axios.post(durl + '/thc-follow-up/doctor/followUp/delete', params)
}
// 根据规则获取模版列表
function searchTemplate (params) {
  return axios.get(
    durl + '/thc-follow-up/doctor/followUpTemplateRule/searchTemplate',
    {
      params: params
    }
  )
}
function getMytask (params) {
  return axios.get(durl + '/thc-follow-up/doctor/followUpItem/getMyTask', { params: params })
}
function getAlltask (params) {
  return axios.get(durl + '/thc-follow-up/doctor/followUpItem/getAllTask', { params: params })
}
function searchMarerial (params) {
  return axios.get(durl + '/thc-follow-up/doctor/material/search', { params: params })
}
function assignTask (params) {
  return axios.post(durl + '/thc-follow-up/doctor/followUpItem/assignTask', params)
}
function cancelTask (params) {
  return axios.post(durl + '/thc-follow-up/doctor/followUpItem/cancel', params)
}
function createForm (params, isCreate) {
  const method = isCreate ? 'createForm' : 'modify'
  return axios.post(`${durl}/thc-follow-up/doctor/material/${method}`, params)
}
function getForm (params) {
  return axios.get(durl + '/thc-follow-up/doctor/material/getFormByCategory', {params: params})
}
function getTask (params) {
  return axios.get(
    durl + '/thc-follow-up/doctor/followUpItem/getById',
    {
      params: params
    }
  )
}
function getSubtaskByDate (params) {
  return axios.get(durl + '/thc-follow-up/doctor/followUpItem/getByDate', {params: params})
}
function getDateByFollowUpId (params) {
  return axios.get(durl + '/thc-follow-up/doctor/followUpItem/getDateByFollowUpId', {params: params})
}
function execTask (params) {
  return axios.post(durl + '/thc-follow-up/doctor/followUpItem/exec', params)
}
function draftTask (params) {
  return axios.post(durl + '/thc-follow-up/doctor/followUpItem/draft', params)
}
function getByCategoryAll (params) {
  return axios.get(
    durl + '/thc-follow-up/doctor/material/getByCategory',
    {
      params: params
    }
  )
}
export default {
  getByCategoryAll,
  draftTask,
  execTask,
  getDateByFollowUpId,
  getSubtaskByDate,
  getTask,
  getHospitalPatient,
  getForm,
  createForm,
  cancelTask,
  assignTask,
  searchMarerial,
  getAlltask,
  getMytask,
  addClassify,
  getAllImageText,
  deleteClassify,
  getCategorydetail,
  getByCategory,
  createImg,
  deleteImg,
  getImgById,
  createModel,
  diseaseSearch,
  deleteModel,
  list,
  getByIdModel,
  getTemplatelist,
  createTask,
  getTaskDetail,
  deleteTask,
  getAllfollowUp,
  createFollowUp,
  getPatientlist,
  getStaff,
  stopFollow,
  taskLog,
  deleteFollowup,
  searchTemplate
}
