
import axios from '@/util/http'
import { diction } from '@/store/common'

const warehouseUrl = diction.api + '/warehouse/'
var warehouse = axios.create({
  baseURL: warehouseUrl,
  withCredentials: true
})

var getReg = /^get\w*Info$/i
var listReg = /^get\w*List$/i
var stockReg = /^get\w*Stock$/i
var queryReg = /^query\w*List$/i
var regs = [
  {
    reg: getReg,
    method: 'get'
  },
  {
    reg: queryReg,
    method: 'list'
  },
  {
    reg: listReg,
    method: 'list'
  },
  {
    reg: stockReg,
    method: 'list'
  }
]

function getMethodType (url) {
  url = url.split('/').filter(v => v).pop()
  for (let i in regs) {
    if (regs[i].reg.test(url)) {
      return regs[i].method
    }
  }
}

warehouse.interceptors.request.use(config => {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

warehouse.interceptors.response.use(function (response) {
  if (response) {
    var url = response.config.url
    let intersFirstName
    if (url.indexOf('/warehouse/') > -1) {
      intersFirstName = url.split('/warehouse/')[1].split('/')[0] // warehouse后第一个名称（有时候返回数据中存在這种数据结构）
    }
    var method = getMethodType(url)
    var emptyResonse = method === 'list' ? [] : response.data.head.errCode ? false : { finally: true }
    // response.data.data 为布尔值的时候直接返回
    if (typeof response.data.data === 'boolean') {
      return response.data.data
    }
    if (!response.data.data || response.data.head.errCode === 204) {
      return emptyResonse
    }
    if (response.data.totalCount && response.data.data.resultList) {
      let tempData = {
        totalCount: response.data.totalCount,
        list: response.data.data.resultList
      }
      if (response.data.data.type) tempData.type = response.data.data.type
      return tempData
    }
    if (response.data.totalCount && response.data.data[0]) {
      return {
        totalCount: response.data.totalCount,
        list: response.data.data
      }
    }
    if (response.data.data[intersFirstName] && response.data.data.resultList) {
      return {
        [intersFirstName]: response.data.data[intersFirstName],
        list: response.data.data.resultList
      }
    }
    var data = response.data.data.resultList || response.data.data
    if (response.data.totalCount || response.data.data.totalCount) data.totalCount = response.data.totalCount || response.data.data.totalCount
    return data
  }
})

warehouse.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

warehouse.jsonToFormData = function (obj) {
  var data = new FormData()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

warehouse.CancelToken = axios.CancelToken
let axiosCancel = {}
/**
 * 取消同一个接口之前未回调的请求
 * @params.url        接口地址
 * @params.params     接口请求参数
 */
warehouse.cancelPost = async (url, params) => {
  try {
    let key = new Date().getTime()
    const res = await warehouse.post(url, params, {
      cancelToken: new warehouse.CancelToken(function executor (c) {
        if (!axiosCancel[url]) {
          axiosCancel[url] = {}
        }
        axiosCancel[url][key] = c
      })
    })
    if (axiosCancel[url]) {
      for (let item in axiosCancel[url]) {
        // 取消本次请求之前未回调的请求 阻断其他未返回结果的接口
        if (axiosCancel[url][item] && Number(item) < key) {
          axiosCancel[url][item]()
          delete axiosCancel[url][item]
        }
      }
      delete axiosCancel[url][key]
    }
    return res
  } catch (err) {
    return null
  }
}

export { warehouse }
