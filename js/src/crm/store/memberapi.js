import { crm as axios, turl, purl, durl } from './api'
import { workspace as waxios } from '../../workspace/store/api'
import { diction } from '@/store/common'

const url = 'member/'
const url1 = '/sob/'
const aurl = 'memberActivity/'
const rurl = 'memberRecord/'
const curl = diction.api + '/c-union/'

// 会员权益绑定—日志
function getSearchLogs (params) {
  return axios.get(durl + '/market/doctor/patientBenefit/searchLogs', { params })
}

// 查询基础信息
function getBaseInfoById (params) {
  return axios.get(url + 'getByPatientId', { params: params })
    .then((response) => {
      return response
    })
}

// 查询基础信息(cunion接口)
function getBaseInfoById1 (params) {
  return axios.get(curl + 'doctor/member/getByPatientId', { params })
}

function list (params) {
  delete params.source
  params.labelIdName && delete params.labelIdName
  if (params.labelIds && params.labelIds.length > 0) {
    params.labelIds = params.labelIds.join(',')
  } else {
    delete params.labelIds
  }
  if (params.type) {
    if (params.type && params.idNo) {
      return axios.get(url + 'search', { params: params })
        .then((response) => {
          response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
          return response
        })
    }
  } else {
    return axios.get(url + 'search', { params: params })
      .then((response) => {
        response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
        return response
      })
  }
}
// 保存更新基本信息(这是什么鬼，为什么调用的地方传了三个参数，这块只接收了两个 20181031) 怎么这么传值
function append (obj, objLabelList) {
  obj.objLabelList = objLabelList
  return axios.post(url + 'append/', { patient: obj, objLabelList: objLabelList, email: obj.email, qq: obj.qq, wechat: obj.wechat, weibo: obj.weibo })
}

function create (obj, objLabelList) {
  objLabelList = objLabelList.map(v => {
    return { 'labelId': v }
  })
  return axios.post(url + 'create/', { patient: obj, objLabelList: objLabelList, email: obj.email, qq: obj.qq, wechat: obj.wechat, weibo: obj.weibo })
}

// 客服呼入 添加客户信息
function createOrUpdate (params) {
  let action = params.id ? 'append' : 'create'
  if (params.agebirthday) {
    params.age = params.agebirthday.age
  }
  delete params.agebirthday
  return axios.post(url + action, { id: params.member ? params.member.id : '', 'patient': params })
}
// 到诊信息
function createArrival (visitNumber) {
  return axios.post(url1 + 'arrival/create', {
    visitNumber: visitNumber
  })
}

// 保存图片信息
function uploadImg (file, type) {
  var path = type === 'face' ? '/c-union/doctor/userFace/uploadFacePhoto' : '/c-union/doctor/img/uploadImg'
  return waxios.post(path, {
    photo: file
  })
}

// 上传face++底图
function upLoadFaceId (params) {
  return axios.get(url + 'modifyFace', {
    params: params
  })
}

function activityList (params) {
  return axios.get(aurl + 'search', { params: params })
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function importMember (file) {
  return axios.post(url + 'importMember', file)
}

// 导入导出记录
function memberRecord (params) {
  return axios.get(rurl + 'getAll', { params: params })
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
// 导出 会员
function exportMember (params) {
  return axios.get('member/exportMember', { params: params })
    .then((response) => {
      return response
    })
}
// 会员标签补充
function appendLabel (params) {
  return axios.post('member/appendLabel', params)
}

function getParam (params) {
  return axios.get(purl + 'doctor/patientRequireParam/getParam', {
    params: params
  })
}
// 患者身份 all
function getAvailable () {
  return axios.get(durl + '/market/doctor/benefit/getAvailable')
}
// 患者身份
function getBenefit (params) {
  return axios.get(durl + '/market/doctor/patientBenefit/getByPatientId', {
    params: params
  })
}
// 积分查询
function pointSearch (params) {
  return axios.post(durl + '/market/doctor/pointsFlow/search', params)
}
// 增加积分
function addPoint (params) {
  return axios.post(durl + '/market/doctor/pointsFlow/addPoints', params)
}
// 就诊卡分类
function getCardType (params) {
  return axios.get(durl + '/c-union/doctor/category/getAllVisitCardType', {
    params: params
  })
}
// 获取就诊卡
function getUserCard (params) {
  return axios.get(durl + '/c-union/doctor/visitCard/getByPatientId', {
    params: params
  })
}
// 创建就诊卡
function createCardType (params) {
  return axios.post(durl + '/c-union/doctor/category/createVisitCardType', params)
}
// 更新就诊卡
function appendCard (params) {
  return axios.post(durl + '/c-union/doctor/patient/appendVisitCard', params)
}
// 绑定患者身份
function bindPatient (params) {
  return axios.post(durl + '/market/doctor/patientBenefit/bind', params)
}
// 批量绑定患者身份
function batchBenefitBind (params) {
  return axios.post(durl + '/market/doctor/patientBenefit/batchBenefitBind', params)
}
// 解绑患者身份
function unbindPatient (id) {
  let params = axios.jsonToFormEncoded({
    id: id
  })
  return axios.post(durl + '/market/doctor/patientBenefit/unbind', params)
}
// 海南  亲属关系
function getAllKinship (params) {
  return axios.get(durl + '/c-union/doctor/category/getAllKinship', {
    params: params
  })
}
// 创建亲属关系
function createKinship (params) {
  return axios.post(durl + '/c-union/doctor/category/createKinship', params)
}
// 删除分类
function deleteCategory (params) {
  return axios.post(durl + '/c-union/doctor/category/delete', params)
}
// 创建客户
function createPatient (params) {
  let action = params.id ? 'append' : 'create'
  return axios.post(durl + '/c-union/doctor/patient/' + action + '?pageType=1', params)
}
// 更新
function updateSecret (params) {
  return axios.post('member/updateSecret', params)
}
// 解锁
function unlockSecret (params) {
  return axios.post('member/unlockSecret', params)
}
// 建档保存客户
function createMemeber (params) {
  return axios.post(durl + '/c-union/doctor/patient/outpatientRegister', params)
}
// 获取匿名sn
function getMousSn () {
  return axios.post(durl + '/c-union/doctor/member/getAnonymousSn')
}
// 获取机构默认地址
function getOrgAdress () {
  return axios.get(durl + '/c-union/doctor/member/getOrgAddress')
}
// 客户查重
function getRepeat (params) {
  return axios.get(durl + '/c-union/doctor/patient/getRepeats', {
    params: params
  }).then(response => {
    return response
  })
}
// 手机号查重
function checkMobile (params) {
  return axios.get(durl + '/c-union/doctor/contact/getByMobile', {
    params: params
  })
}
function getAddress (params) {
  return axios.get(durl + '/thc-platform-core/area/getAddress', {
    params: params
  })
}
// 建档并绑定预约
function bindAppointment (params) {
  return axios.post(durl + '/arrange/appointment/createPatientAndBindAppointmentRecord', params)
}

// 更新头像信息
function updataUserAvt (params) {
  return axios.get(curl + 'doctor/patient/modifyPic', {
    params: params
  })
}

function createFast (params) { // 快速建档创建
  return axios.post(purl + 'doctor/member/createFast', params)
}

export default {
  createFast,
  getBaseInfoById,
  append,
  create,
  createArrival,
  diction,
  uploadImg,
  upLoadFaceId,
  list,
  activityList,
  createOrUpdate,
  importMember,
  turl,
  purl,
  memberRecord,
  exportMember,
  appendLabel,
  getParam,
  getBaseInfoById1,
  getAvailable,
  getBenefit,
  pointSearch,
  getCardType,
  createCardType,
  bindPatient,
  batchBenefitBind,
  unbindPatient,
  getUserCard,
  appendCard,
  addPoint,
  getRepeat,
  // 海南
  getAllKinship,
  createKinship,
  deleteCategory,
  createPatient,
  unlockSecret,
  updateSecret,
  createMemeber,
  getMousSn,
  getOrgAdress,
  checkMobile,
  getAddress,
  bindAppointment,
  updataUserAvt,
  getSearchLogs
}
