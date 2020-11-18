import { warehouse as axios } from './api'
import { auth } from '@/auth/store/api.js'
const url = 'staff/'
const urlRole = 'staffRole/'
const urlRank = 'staffRank/'
const newUrl = '/thc-platform-core/out'
function getById (id) {
  return axios.post(url + 'getStaffInfo/', {
    id
  }).then(result => {
    if (result.jobShiftId === 0) {
      result.jobShiftId = ''
    }
    var obj = result
    if (obj.staffClinicList && obj.staffClinicList[0]) {
      obj.staffClinicList = obj.staffClinicList.map(v => {
        return v
      })
    }
    return obj
  })
}

function createOrUpdate (staff) {
  let staffClinicList = staff.staffClinicList.map(v => {
    return {
      clinicId: v.clinicId ? v.clinicId : v
    }
  })
  staff.staffClinicList = staffClinicList
  var path = staff.id ? 'updateStaff' : 'createStaff'
  return axios.post(url + path + '/', staff)
}

function del (id) {
  return axios.post(url + 'updateStaff/', {
    id: id,
    isDelete: 1
  })
}
async function list (params) {
  return await auth.post('thc-platform-core/out/' + 'staff/getStaffListByCondition/', params)
}

function lists (params) {
  return axios.post(newUrl + 'getStaffLists/', params)
    .then((response) => {
      return response
    })
}
function updateStaffList (params) {
  return axios.post(url + 'updateStaffList/', params)
    .then((response) => {
      return response
    })
}

function gettype (params) {
  return axios.post(url + 'getStaffDepartmentStorageTypeList/', params)
    .then((response) => {
      return response
    })
}

function getStaffRoleList (params) {
  return axios.post(urlRole + 'getStaffRoleList/', params)
}

function createStaffRole (params) {
  return axios.post(urlRole + 'createStaffRole/', params)
    .then((response) => {
      return response
    })
}

function updateStaffRole (id) {
  return axios.post(urlRole + 'updateStaffRole/', {
    id: id,
    isDelete: 1
  })
}

// function createOrUpdateStaffRank (obj) {
//   var path = obj.id ? 'updateStaffRank' : 'createStaffRank'
//   return axios.post(urlRank + path + '/', obj)
//     .then((response) => {
//       return response
//     })
// }

// function getByRankId (id) {
//   return axios.post(urlRank + 'getStaffRankInfo/', {
//     id
//   }).then(result => {
//     return result
//   })
// }

function listRank (id) {
  return axios.post(urlRank + 'getStaffRankList/', {
    staffId: id
  }).then(result => {
    return result
  })
}

function getDoctorList (params) {
  return axios.post('staffRecord/getStaffRecordVoListForService/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  updateStaffList,
  gettype,
  getStaffRoleList,
  createStaffRole,
  updateStaffRole,
  lists,
  // createOrUpdateStaffRank,
  // getByRankId,
  listRank,
  getDoctorList
}
