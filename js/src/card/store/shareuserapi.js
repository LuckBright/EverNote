import {
  card as axios
}
from './api'
const url = '/memberCardShare/'

function getById (id) {
  return axios.get(url + 'getById/', {params: {
    id: id
  }}).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  console.log(obj, 11)
  return axios.post(url + 'createBatch/', obj)
}

function list (params) {
  return axios.get(url + 'getByCardId/', {params: params})
    .then((response) => {
      return response
    })
}

export default {
  getById,
  createOrUpdate,
  list
}
