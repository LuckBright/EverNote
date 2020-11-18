import axios from '../api'

function list (params) {
  return axios.post('pay/bill', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getById (id) {
  return axios.post('pay/billDetail', {
    id: id
  }).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  list,
  getById
}
