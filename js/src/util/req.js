import httpAxios from '@/util/http'
import originAxios from 'axios'
import { diction } from '@/store/common'
import { staticPath } from '@/util/urls'
import {deepClone, deepCompare} from '@/util/fns'
/**
 * @Description: 对http.js中的axios再次封装，使得请求可以配置为是否请求静态文件
 * @author fuyongbo@everjiankang.com
 * @date 2019-04-11
*/
const cachedReqStackMap = {}
/* 拦截原生axios的响应 使其保持与各api中的一致 */
originAxios.interceptors.response.use(function (response) {
  return response.data
})
function create (options, customOptions) {
  // 直接根据baseURL创建axios
  if (!options) {
    options = { baseURL: diction.api }
  } else if (typeof options === 'string') {
    options = { baseURL: diction.api + options }
  } else {
    options = { baseURL: diction.api + options.baseURL, ...options }
  }
  const axios = httpAxios.create(options)

  axios.interceptors.request.use(function (config) {
    if (!config.data) {
      config.data = {}
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  axios.interceptors.response.use(function (response) {
    // 如果请求成功了，则根据是否需要缓存数据进行判断
    if (response && response.data && response.data.head && response.data.head.errCode === 0) {
      if (customOptions && customOptions.useCache) {
        customOptions._this.$store.commit('setAxiosCache', {
          url: getUrl(customOptions.url).url,
          params: customOptions.data,
          result: response.data,
        })
        // 将队列中的promise执行并返回
        let reqList = cachedReqStackMap[getUrl(customOptions.url).url]
        if (reqList && reqList.length) {
          reqList.filter(r => deepCompare(deepClone(r.params, true), deepClone(customOptions.data, true))).forEach(item => {
            item.resolve(response.data)
          })
          // 清除队列
          cachedReqStackMap[getUrl(customOptions.url).url] = cachedReqStackMap[getUrl(customOptions.url).url].filter(r => !deepCompare(deepClone(r.params, true), deepClone(customOptions.data, true)))
        }
      }
    }
    return response && response.data
  })
  return axios
}
const getSaveUrl = ({url, noSlash}) => {
  return url.includes('?') ? url : (url.endsWith('/') ? url : (url + (noSlash ? '' : '/')))
}
export const getUrl = url => {
  if (!url) {
    throw new Error('检测到url为空，请使用正确的url')
  }
  let urlConfig = {}
  if (typeof url === 'string') {
    urlConfig = { url: getSaveUrl({url, noSlash: true}), isStatic: false }
  } else if (url.isStatic) {
    urlConfig = { url: (url.staticPath || staticPath) + (url.prefix || '') + url.url + '.json', isStatic: true }
  } else {
    urlConfig = { url: getSaveUrl({url: (url.prefix || '') + url.url, noSlash: url.noSlash}), isStatic: false }
  }
  return urlConfig
}
// 遇到静态请求则使用原始axios发送get请求，否则使用http.js中的axios发送请求
const getAxiosRes = (url, params, fn) => {
  const urlConfig = getUrl(url)
  if (urlConfig.isStatic) {
    return originAxios.get(urlConfig.url, params)
  } else {
    return fn()
  }
}
const defaultAxios = create()
const methods = {
  get (url, params = {}, axios = defaultAxios) {
    return getAxiosRes(url, { params }, () => axios.get(getUrl(url).url, { params }))
  },
  post (url, data = {}, axios = defaultAxios) {
    return getAxiosRes(url, { params: data }, () => axios.post(getUrl(url).url, data))
  },
  put (url, data = {}, axios = defaultAxios) {
    return getAxiosRes(url, { params: data }, () => axios.put(getUrl(url).url, data))
  },
  delete (url, data = {}, axios = defaultAxios) {
    return getAxiosRes(url, { params: data }, () => axios.delete(getUrl(url).url, data))
  }
}
export function request (url, data = {}, method = 'post', axios, options) {
  const me = this
  let axiosInst = axios || defaultAxios
  if (options) {
    if (options.useCache) {
      // 使用缓存策略
      axiosInst = create(null, {
        url,
        data,
        useCache: options ? options.useCache : false,
        _this: me,
      })
      // 寻找缓存中的数据并返回
      const cacheResult = findCache.bind(me)(url, data)
      if (cacheResult) {
        return new Promise(resolve => resolve(cacheResult))
      } else {
        // 找到队列数组中，参数与本次请求参数一致的是否存在，若存在，则将其放入队列，若不存在，在发送请求
        let reqList = cachedReqStackMap[getUrl(url).url]
        if (!reqList || (reqList && !reqList.length)) {
          reqList = cachedReqStackMap[getUrl(url).url] = []
        }
        const promise = new Promise(resolve => {
          cachedReqStackMap[getUrl(url).url].push({
            params: data,
            resolve,
          })
        })
        const asSameAsCrtReqList = reqList.filter(r => deepCompare(deepClone(r.params, true), data))
        if (asSameAsCrtReqList.length > 1) {
          return promise
        } else {
          return methods[method](url, data, axiosInst)
        }
      }
    }
  }
  return methods[method](url, data, axiosInst)
}
// 带有缓存功能的请求，若发送的请求 url 和 params 均相同，则不会
// 调用方式：requestWithCache.bind(this)(url, data)
export function requestWithCache (url, data = {}, method = 'post', axios = defaultAxios, options = {useCache: true}) {
  return request.bind(this)(url, data, method, axios, options)
}
// 互联网医院请求
export function requestIh (url, data = {}, method = 'post', axios, options) {
  return request(url, data, method, axios || create({
    baseURL: diction.apiIh,
    channelType: 'api-ih'
  }), options)
}
function findCache (url, data) {
  const me = this
  /**
   * cacheDataList = [
   *   {
   *     params: {a: 1, b: 2},
   *     result: ['xxx', 'xxx']
   *   },
   *   {
   *     params: {a: 1, b: 3},
   *     result: ['xxx', 'xxx', 'xxx']
   *   },
   * ]
   */
  const cacheDataList = me.$store.state.cacheData[getUrl(url).url]
  // 若找到了缓存中的数据，且查询参数与之前的保持一致，则返回此
  if (cacheDataList && cacheDataList.length > 0) {
    const cacheData = cacheDataList.find(item => deepCompare(deepClone(item.params, true), data))
    if (cacheData) {
      return cacheData.result
    }
  }
  return null
}

export default {
  request,
  requestIh,
  ...methods,
  create,
}
