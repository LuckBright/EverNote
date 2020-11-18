import { workspace as axios } from '@/workspace/store/api'
import { auth } from '@/auth/store/api.js'
let url = 'sob/recipeTemplate/'

function list (param) {
  let params = {
    templateType: param.templateType,
    sceneType: param.sceneType || '',
    templateSource: param.templateSource || '',
    templateName: param.templateName || '',
    offset: param.offset,
    pagesize: param.pagesize
  }
  let keys = ['providerId', 'providerIdList', 'areaId', 'areaIdList']
  keys.forEach(k => {
    if (param[k]) {
      params[k] = param[k]
    }
  })
  return axios.post(url + 'queryList', params).then(result => {
    return {
      list: result.data || [],
      totalCount: result.totalCount || 0
    }
  })
}

function del (id) {
  return axios.post(url + 'deleteById', {id})
}

function createOrUpdate (obj) {
  let action = obj.id !== '-1' ? 'updateById' : 'create'
  return axios.post(url + action, obj)
}

function getById (id) {
  return axios.post(url + 'getById', {id}).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => {
    return false
  })
}

// 获取所有处方模版list(包括个人模版，机构模版)
function getAllTplList (params) {
  return axios.post(url + 'queryTemplateListForService', params).then(res => {
    if (res && res.data) {
      return res.data || []
    }
    return []
  }).catch(() => [])
}

// 获取医生所属科室
function getDoctorOffice (params) {
  /**
   * 住院-01.01 门诊-01.02 急诊-01.03
   * outSubjectGetTenantSubjectListByConditionReqDTO: {
   *   type2CodeList: []
   * }
   * outStaffGetStaffListByConditionReqDTO: {
   *   idList: []
   * }
   */
  return auth.post('/thc-platform-core/out/subject/getTenantSubjectListHasStaffByCondition', params).then(res => {
    if (res.data && res.data.resultList) {
      return res.data.resultList
    }
    return false
  }).catch(() => {
    return false
  })
}

// 获取护士所属病区
function getNurseArea (params) {
  /**
   * staffIdList: [] 人员列表
   */
  return auth.post('/thc-platform-core/out/sickArea/getSickAreaListByCondition', params).then(res => {
    if (res.data && res.data.resultList) {
      return res.data.resultList
    }
    return false
  }).catch(() => {
    return false
  })
}

export default {
  list,
  del,
  getById,
  createOrUpdate,
  getAllTplList,
  getDoctorOffice,
  getNurseArea
}
