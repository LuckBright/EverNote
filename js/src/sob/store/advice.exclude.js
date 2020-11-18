import {sob as axios} from './api'
const url = 'excludeAdvice/'

function list (params) {
  return axios.post(url + 'getExcludeAdvices', params)
    .then((response) => {
      return response
    })
}

function createOrUpdate (obj) {
  let path = obj.id ? 'updateExcludeAdvice' : 'createExcludeAdvice'
  return axios.post(url + path + '/', obj)
}

function getById (id) {
  return axios.post(url + 'getExcludeAdvice', {id})
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
  return axios.post(url + 'removeExcludeAdvice/', {id})
}

export default {
  list,
  createOrUpdate,
  getById,
  del
}
