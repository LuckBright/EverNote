import {sob as axios} from './api'
const url = 'frequency/'

function list (params) {
  return axios.post(url + 'getFrequencys', params)
    .then(response => {
      return response
    })
}

function createOrUpdate (obj) {
  let path = obj.id ? 'updateFrequency' : 'createFrequency'
  return axios.post(url + path + '/', obj)
}

function getById (id) {
  return axios.post(url + 'getFrequency', {id})
    .then(result => {
      if (result && result.data) {
        result.data.isValid = '' + result.data.isValid
        return result.data
      } else {
        return {}
      }
    })
}

function del (id) {
  return axios.post(url + 'removeFrequency/', {id})
}

export default {
  list,
  del,
  createOrUpdate,
  getById
}
