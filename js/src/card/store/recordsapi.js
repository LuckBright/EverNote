import {
  card as axios
}
from './api'
const url = '/memberCardStatement/'

function getById (id) {
  return axios.get(url + 'getById', {params: {
    id: id
  }}).then(result => {
    return result
  })
}
function list (params) {
  return axios.get(url + 'getPageByCardId/', {params: params})
    .then((response) => {
      return response
    })
}
function exportFile (params) {
  return axios.get(url + 'export/', {params: params})
    .then((response) => {
      return response
    })
}
export default {
  getById,
  list,
  exportFile
}
