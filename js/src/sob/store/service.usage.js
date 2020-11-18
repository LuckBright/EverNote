import {
  sob as axios
} from './api'
const url = 'servUsageAddtion/'

function list (params) {
  return axios.post(url + 'getUsageAddtionList', params)
    .then((response) => {
      return response
    })
}

function createOrUpdate (obj) {
  return axios.post(url + 'updateUsageAddtion', obj)
}

function importUsageAddtionList (obj) {
  return axios.post(url + 'importUsageAddtionList', obj)
}

function getById (id) {
  return axios.post(url + 'getUsageAddtionList', {
    id
  })
  .then(result => {
    if (result && result.data) {
      return result.data
    } else {
      return {}
    }
  })
}

function del (id) {
  return axios.post(url + 'deleteUsageAddtion/', {
    id
  })
}

export default {
  list,
  createOrUpdate,
  importUsageAddtionList,
  getById,
  del
}
