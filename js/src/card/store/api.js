import axios from '@/util/http'
// import { Notification } from 'element-ui'
import {diction} from '@/store/common'
const url = diction.api + '/market/doctor/'

let card = axios.create({
  baseURL: url
})
card.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

card.interceptors.response.use(function (response) {
  if (response.config.method === 'post') {
    if (response.data.head.errCode === 0) {
      // Notification.success('操作成功')
    }
  }
  return response.data
})

card.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

export {card, diction}
