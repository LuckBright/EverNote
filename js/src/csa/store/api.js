import axios from '@/util/http'
import {diction} from '@/store/common'
import storage from '@/util/storage'

const url = diction.api

var arrange = axios.create({
  baseURL: url,
  withCredentials: true
})

arrange.interceptors.request.use(config => {
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

arrange.interceptors.response.use(function (response) {
  if (response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

arrange.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}
arrange.jsonToFormData = function (obj) {
  var data = new FormData()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

export {arrange}
