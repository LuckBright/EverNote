import axios from '@/util/http'
import {diction} from '@/store/common'
import storage from '@/util/storage'

const url = diction.api + '/scheduled/'

var scheduled = axios.create({
  baseURL: url,
  withCredentials: true
})

scheduled.interceptors.request.use(config => {
  const TICKET = storage.getStorageByClinic('x-ticket-code')
  if (!config.data) {
    config.data = {}
  }
  if (TICKET) {
    config.headers['x-ticket-code'] = TICKET
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

scheduled.interceptors.response.use(function (response) {
  if (response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

scheduled.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}
scheduled.jsonToFormData = function (obj) {
  var data = new FormData()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

export {scheduled}

