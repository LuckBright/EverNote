import http from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api

var axios = http.create({
  baseURL: url,
  withCredentials: true
})

axios.interceptors.response.use(function (response) {
  return response.data
})

function add (params) {
  return axios.post('/platform-extend/cdss-agent/medicineAllergy/save', params).then(result => {
    return result
  })
}
function searchList (params) {
  return axios.post('/platform-extend/cdss-agent/medicineAllergy/list', params).then(result => {
    return result
  })
}

function deleteRequest (params) {
  return axios.post('/platform-extend/cdss-agent/medicineAllergy/delete', params).then(result => {
    return result
  })
}

export default {
  add,
  searchList,
  deleteRequest
}
