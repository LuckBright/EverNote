import { workspace as axios } from './api'
// import { ajax as axios2 } from './yapi'
import { diction } from '@/store/common'
const url = 'c-union/doctor/patient/'
const url1 = '/sob/'
const url2 = '/insurance/'

// 查询基础信息
function getBaseInfoById (id) {
  return axios.get(url + 'getById', {
    params: {
      id: id,
      needIden: true
    }
  }).then(result => {
    result.data.agebirthday = {
      age: result.data.age,
      birthday: result.data.birthday
    }
    return result
  })
}

// 接诊界面患者信息回显
function getPatitentById (patitentId, visitNumber) {
  return axios({
    url: '/sob/encounter/getPatitentById',
    method: 'post',
    data: {
      patitentId: patitentId,
      visitNumber: visitNumber
    }
  }).then(result => {
    // result.data.agebirthday = {
    //   age: result.data.age,
    //   birthday: result.data.birthday
    // }
    return result.data
  })
}

// 获取患者基本信息
function getById (id) {
  return axios.get(`/c-union/doctor/patient/getById?id=${id}&needIden=true`)
}
// 接诊界面患者信息回显后修改
function append (options) {
  return axios({
    url: '/c-union/doctor/patient/append',
    method: 'post',
    data: options
  }).then(result => {
    // result.data.agebirthday = {
    //   age: result.data.age,
    //   birthday: result.data.birthday
    // }
    return result
  })
}

// 读取社保卡
function autoReadIcCardInfo (data) {
  return axios.post(url2 + 'ccyb/getPersonInfo', data).then(result => {
    return result
  })
}

// 查询当前机构是否社保机构
function getInsuranceOrg (id) {
  return axios.post(url2 + 'insuranceOrg/getMedicareOrgByClinicId', { clinicId: id }).then(result => {
    return result
  })
}

// 保存更新基本信息
function createOrUpdate (obj) {
  let params = Object.assign({}, obj)
  // delete params.mobile
  // if (obj.agebirthday) {
  //   // if (obj.agebirthday.birthday) {
  //   //   params.birthday = new Date(obj.agebirthday.birthday).getTime()
  //   // } else {
  //   //   params.birthday = null
  //   // }
  //   params.age = obj.agebirthday.age
  // }
  params.pregnant = (params.pregnant) ? 1 : 0
  delete params.agebirthday
  if (params.iden && params.iden.idNo === '') {
    delete params.iden
  }
  let path = obj.id ? 'append' : 'create'
  return axios.post(url + path + '/', params)
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
  return axios.post(path, {
    photo: file
  })
}

// 上传face++底图
function upLoadFaceId (params) {
  return axios.get(url + 'modifyFace', {
    params: params
  })
}
//
// // 获取会员编号
// function getSn () {
//   return axios.get(url + 'getSn')
// }

// 获取患者身份
function getBenefit (params) {
  return axios.get('/market/doctor/patientBenefit/getByPatientId', {
    params
  })
}
// 模糊查询患者信息
function searchFuzzy (params) {
  return axios.get(`${url}searchFuzzy`, { params })
}
export default {
  getById,
  getBaseInfoById,
  createOrUpdate,
  createArrival,
  diction,
  uploadImg,
  upLoadFaceId,
  autoReadIcCardInfo,
  getInsuranceOrg,
  getPatitentById,
  append,
  getBenefit,
  searchFuzzy
}
