import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api + '/phr/doctor/'
const purl = diction.api + '/phr-proxy/doctor/'
var phr = axios.create({
  baseURL: url
})
phr.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

phr.interceptors.response.use(function (response) {
  return response.data
})

phr.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

export { phr, purl, diction }
