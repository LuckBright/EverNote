import {workspace as axios} from '../../workspace/store/api'
let url = 'phr/doctor/hospitalizedDocument/'

function saveRecord (content) {
  return axios.post(url + 'create', {
    content
  })
}

function getByOrgId (id) {
  return axios.post(url + 'getByOrgId', {
    id
  })
}
export default {
  saveRecord,
  getByOrgId
}
