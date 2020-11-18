import qs from 'qs'

import { getInstance } from '../api'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()
const axios1 = getInstance()
const axios2 = getInstance()

axios.defaults.baseURL += prefix.cms
axios1.defaults.baseURL += prefix.mall
axios2.defaults.baseURL = '/api/'

let url = '/'
const thcUrl = `${diction.api}/thc-platform-core/`
const videoURL = `${diction.api}/titan-video-cms/`
const liveURL = `${diction.api}/titan-doctor/`

// 获取首页信息
function getHomeInfo (params) {
  return axios.post(url + 'memberHomePage/selectHomePageInfoByTenantId', params)
}

// 获取首页信息
function saveHomeInfo (params) {
  return axios.post(url + 'memberHomePage/saveOrOnlineMemberHomePageInfo', params)
}

// 查询值集
function getValueSetItemByCode (params) {
  return axios.post(thcUrl + 'valueSetItem/getValueSetItemByCode', params)
}

// 短视频
function getVideos (params) {
  return axios.post(videoURL + 'video/cms/query', { offset: 0, pagesize: 100, status: 1, top: 1 })
}

// 直播
function getLiveList (params) {
  return axios.post(liveURL + '/v4.1/live/recommend/list')
}

// 咨询
function getNewsList (params) {
  return axios.post(url + 'article/list', params)
}

// 短视频
function getDoctorList (params) {
  return axios.post(url + 'team/getDoctorList', params)
}
// 商品分组
function getListBySpuGroup (params) {
  return axios1.post(url + 'third/spu/listBySpuGroup', params)
}
// 商品列表
function getSupSearch (params) {
  return axios1.post(url + 'third/spu/list', params)
}
// 医生列表
function searchDoctors (params) {
  return axios.post(url + 'region/getStaffList', params)
}
// 保障计划模板列表
export function getTemplateList (params) {
  return axios2.get(`market/doctor/setmeal/search?${qs.stringify(params)}`)
}

// import sysValue from '@/titancare/components/sys.value'
// <sys-value code="GBT.2261.2" val="20"></sys-value><hr />
var requestMap = {}
let resultObj = {}
function listOnce (code) {
  if (!code) {
    return Promise.resolve([])
  }
  if (!resultObj[code]) {
    if (!requestMap[code]) {
      requestMap[code] = []
    }
    let promise = new Promise(function (resolve, reject) {
      requestMap[code].push(resolve)
    })
    if (requestMap[code].length < 2) {
      let params = {
        setCode: code
      }
      getValueSetItemByCode(params).then(result => {
        resultObj[code] = result
        requestMap[code].forEach(p => {
          p(result)
        })
        requestMap[code] = []
      })
    }
    return promise
  } else {
    return Promise.resolve(resultObj[code])
  }
}

export default {
  getDoctorList,
  getNewsList,
  getLiveList,
  getHomeInfo,
  saveHomeInfo,
  getVideos,
  getValueSetItemByCode,
  getListBySpuGroup,
  getSupSearch,
  searchDoctors,
  listOnce,
  getTemplateList
}
