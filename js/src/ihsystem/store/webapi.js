import { web as axios } from './api'
const url = '/arrange/appt'
const urlCms = '/titan-cms'
const urlDoctor = '/titan-doctor/doctor'
function searchList (params) {
  return axios.post(`${url}/third-party/queryList/`, params).then(result => {
    return result
  })
}

function getSig () {
  let params = {doctorId: localStorage.getItem('USERID')}
  return axios.get(`${urlCms}/counsel/getImParams`, {params})
    .then(result => {
      return result
    })
}

function getGroupId (params) {
  return axios.get(`${urlCms}/admin/getGroupId/${params}`)
}

function getGroupMember (params) {
  return axios.get(`${urlDoctor}/getGroupMember2/${params}`)
}

function getAppointState (params) {
  return axios.post(`${url}/third-party/getByVisitNumber/`, params).then(result => {
    if (result.data) {
      return result.data.appointmentState
    } else {
      return -1
    }
  })
}

function getApolloValue (params) {
  return axios.post(`/thc-platform-core/apollo/getValue`, params)
}

export default {
  searchList,
  getSig,
  getGroupId,
  getGroupMember,
  getAppointState,
  getApolloValue
}
