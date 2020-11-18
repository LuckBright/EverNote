import { sob as axios } from './api'

function list (params) {
  return axios.post('serviceProcessR/query', params)
    .then((response) => {
      return response
    })
}

function createOrUpdate (params) {
  let path = params.id ? 'update' : 'create'
  return axios.post(`serviceProcessR/${path}`, params)
}

function getById (id) {
  return axios.post('serviceProcessR/getById', {
    id
  }).then(result => {
    result.data.process = {
      id: result.data.processKey,
      name: result.data.processName
    }
    result.data.isValid = '' + result.data.isValid
    return result.data
  })
}

function del (id) {
  return axios.post('serviceProcessR/delete', {
    id
  })
}

export default {
  list,
  createOrUpdate,
  getById,
  del,
}
