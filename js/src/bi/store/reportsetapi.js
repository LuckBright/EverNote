import { bi as axios, bi2 as axios2 } from './api'
import { diction } from '@/store/common'

const url = 'bIController/'
const warehouseurl = 'warehouse/'
const arrangeurl = 'arrange/'

function getById (id) {
  return axios.post(url + 'get', {
    id
  }).then(result => {
    if (result.data && result.data.details) {
      result.data.details.map(item => {
        item.language += ''  // 接口里返回的是Number,需要转换成string
      })
    }
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

// 查询列表
function list (params) {
  return axios.post(diction.api + '/platform-extend/reportnew/search', params)
}

// todo 人员搜索，调用的地方太多，需要抽象出来
function getStaffList (params) {
  return axios2.post(warehouseurl + 'staff/getStaffList/', params)
    .then((response) => {
      return response
    })
}

function queryListOfStatisticsOfDoctorWorkDay (params) {
  return axios2.post(arrangeurl + 'statistics/queryListOfStatisticsOfDoctorWorkDay', params)
    .then((response) => {
      return response
    })
}

function exportDoctorWorkDay (params) {
  return axios2.post(arrangeurl + 'statistics/exportDoctorWorkDay', params)
    .then((response) => {
      return response
    })
}

export default {
  getById,
  createOrUpdate,
  list,
  getStaffList,
  queryListOfStatisticsOfDoctorWorkDay,
  exportDoctorWorkDay
}
