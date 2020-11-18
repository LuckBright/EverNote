import axios from '@/util/http'
import { Notification } from 'element-ui'
import {diction} from '@/store/common'
const url = diction.api + '/c-mall/doctor/'
const url1 = diction.api + '/c-union/doctor/'
const url2 = diction.api + '/c-union/doctor/'

let mall = axios.create({
  baseURL: url
})
let mallCart = axios.create({
  baseURL: url
})
let passport = axios.create({
  baseURL: url1
})
let cUnion = axios.create({
  baseURL: url2
})

cUnion.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

cUnion.interceptors.response.use(function (response) {
  if (response.config.method === 'post') {
    if (response.data.head.errCode === 0) {
      Notification.success('操作成功')
    }
  }
  if (response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

cUnion.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

passport.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

passport.interceptors.response.use(function (response) {
  if (response.config.method === 'post') {
    if (response.data.head.errCode === 0) {
      Notification.success('操作成功')
    }
  }
  if (response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

passport.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

mall.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

mall.interceptors.response.use(function (response) {
  if (response.config.method === 'post') {
    if (response.data.head.errCode === 0) {
      Notification.success('操作成功')
    }
  }
  return response.data
})

mall.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

mallCart.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

mallCart.interceptors.response.use(function (response) {
  if (response.config.method === 'post') {
    // if (response.data.head.errCode === 0) {
    //   Notification.success('操作成功')
    // }
  }
  return response.data
})

mallCart.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

export {passport, diction, mall, mallCart, cUnion}
