import axios from '@/util/http'
import { Notification } from 'element-ui'
import {diction} from '@/store/common'
const url = diction.api + '/c-union/doctor/'

var crm = axios.create({
  baseURL: url
})
crm.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

crm.interceptors.response.use(function (response) {
  if (response.config.method === 'post') {
    if (response.data.head.errCode === 0) {
      Notification.success('操作成功')
    }
  }
  return response.data
})

crm.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

export {crm, diction}
