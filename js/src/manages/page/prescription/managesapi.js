import {sob as axios} from '@/sob/store/api'
import { auth } from '@/auth/store/api.js'
const newUrl = '/thc-platform-core/out/'

let urlType = {
  prescription: {
    list: 'service/queryService/',
    permissList: 'service/getChildOrgServiceList',
    permissCreate: 'service/createOrgService'
  },
  stack: {
    list: 'serviceset/queryServiceSet/',
    permissList: 'serviceset/getPermissionByServiceSetId',
    permissCreate: 'serviceset/updateChildServiceSet'
  }
}

// 获取医嘱和组套医嘱项目关联机构的信息
async function getChildOrgServiceList (id, type) {
  let params = {}
  if (type === 'stack') {
    params = {serviceSetId: id}
  } else {
    params = {serviceId: id}
  }
  let res = await axios.post(urlType[type].permissList, params)
  if (res.data && res.data.length) {
    return res.data
  }
  return []
}

// 获取机构科室
async function getLocalSectionVoListForService (params) {
  // let res = await auth.post(newUrl + 'subject/getTenantSubjectListHasStaffByCondition', params)
  let res = await auth.post(newUrl + 'subject/getTenantSubjectListByCondition', params)
  if (res && res.data && res.data.resultList) {
    return res.data.resultList || []
  }
  return []
}

// 获取城市
async function getClinicCityList () {
  // if (cache.citys) {
  //   return cache.citys
  // }
  let res = await auth.post(newUrl + 'organization/getOrgProvinceList')
  if (res && res.data) {
    return res.data || []
  }
  return []
}

// 按层级获取机构树
async function getTreeNodes (params) {
  let res = await auth.post(newUrl + 'organization/getOrgAndChildrenByCondition', params)
  if (res && res.data) {
    return res.data
  }
  return []
}

// 按城市获取机构树
async function getCityTreeNodes (params) {
  let res = await auth.post(newUrl + 'organization/getOrgListByCondition', params)
  if (res && res.data) {
    return res.data
  }
  return []
}

// 保存机构引用医嘱项和组套
function createOrgService (params, type) {
  if (type === 'stack') {
    let serviceSetId = params.serviceId
    let list = params.orgServiceRelations.map(item => {
      return {serviceSetId, ...item}
    })
    params = list
  }
  return axios.post(urlType[type].permissCreate, params)
}

// 获取医嘱项和套餐的列表
function list (type) {
  return (params) => {
    return axios.post(urlType[type].list, params)
    .then((res) => {
      if (res.data && res.data.length) {
        let data = res.data.map(item => {
          item.classification = item.serviceClassification || item.serviceSetClassification
          return item
        })
        res.data = data
        return res
      }
      res.data = []
      return res
    })
  }
}

// 获取医嘱项和组套新建权限
async function getClinicManageConfigForRecord (params) {
  let res = await auth.post('/thc-platform-core/config/getClinicManageConfigForRecord', params)
  if (res && res.data) {
    return res.data
  }
  return {}
}

export default {
  getChildOrgServiceList,
  getTreeNodes,
  getLocalSectionVoListForService,
  createOrgService,
  getClinicCityList,
  list,
  getClinicManageConfigForRecord,
  getCityTreeNodes
}
