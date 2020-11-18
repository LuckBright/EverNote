import { arrange as axios } from './api'
const url = '/arrange/'
// const url2 = '/sob/'
// const url2 = '/warehouse/'
function list (params) {
  return axios.post(url + 'templet/list', params)
    .then(result => {
      return result
    })
}
function del (id) {
  return axios.post(url + 'templet/delete', { id: id })
}

function getMainResourceType (params) {
  return axios.post(url + 'resourceType/getMainResourceType', params)
}

function getSubResourceTypeByParentCode (params) {
  return axios.post(url + 'resourceType/getSubResourceTypeByParentCode', params)
}

function updateArrangeTemplate (params) {
  let fun = params.id ? 'templet/update' : 'templet/add'
  return axios.post(url + fun, params)
}

function getAudit (params) {
  return axios.post(url + 'resourceArrange/checklog/search', params)
}

function getRoom (params) {
  return axios.cancelPost(url + 'resourceArrange/clinic/search', params)
}

function updateRoom (params) {
  return axios.post(url + 'resourceArrange/clinic/codeset', params)
}

function getRoomdata (params) {
  return axios.post(url + 'resource/searchClinicRooms', params)
}

export default {
  list,
  del,
  updateArrangeTemplate,
  getMainResourceType,
  getSubResourceTypeByParentCode,
  getAudit,
  getRoom,
  updateRoom,
  getRoomdata
}
