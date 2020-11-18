import axios from '@/util/http'
// import { Notification } from 'element-ui'

let baseapi = axios.create({
  baseURL: '/',
  responseType: 'document' // 默认值是json
})

baseapi.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

baseapi.interceptors.response.use(function (response) {
  return response
})

baseapi.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}
export { baseapi }
