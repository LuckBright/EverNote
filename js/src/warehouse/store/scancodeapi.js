import {warehouse as axios} from './api'
const url = 'scancode/'

function getById (params) {
  return axios.post(url + 'addScanCode/', params).then(result => {
    return result
  })
}

export default {
  getById
}
