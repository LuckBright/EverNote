import {workspace as axios} from './api'
let url = '/arrange/appoint/'

function list (params) {
  return axios.post(url + 'query', params).then(result => {
    return result
  })
}

function getRcm (params) {
  return axios.post('/sob/order/createOrderRecordBook', params).then(result => {
    return result.data.rcmId
  })
}

export default {
  list,
  getRcm
}
