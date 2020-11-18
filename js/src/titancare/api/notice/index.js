import { getInstance } from '../api'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()

axios.defaults.baseURL += prefix.cms

let url = 'cms/v1.1/notice/'

// 创建修改通知消息
function createAndUpdate (params) {
  let type = params.id ? 'updateMessage' : 'createAndUpdate'
  return axios.post(url + type, params)
}

// 查询通知列表
function getNoticeList (params) {
  return axios.post(url + 'getNoticeList', params)
}

// 删除通告消息
function deleteNotice (params) {
  return axios.post(url + 'delete', params)
}

export default {
  createAndUpdate,
  getNoticeList,
  deleteNotice
}
