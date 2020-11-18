import axios from '@/util/http'
import { diction } from '@/store/common'

const url = diction.api
let ch = axios.create({
  baseURL: url,
  withCredentials: true
})
ch.interceptors.request.use(
  function (config) {
    if (!config.data) {
      config.data = {}
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

ch.interceptors.response.use(function (response) {
  if (!response) {
    return Promise.reject()
  }
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

// 获取模版
function getCheckBox (id) {
  return ch.post('/platform-extend/doctor/thcPageHeadTemplateConfig/getDetailById', {
    id
  })
}
// 获取值集列表
function getSysTypeInfoList (data) {
  return ch.post('warehouse/sysTypeInfo/getSysTypeInfoList/', data)
}

// 编辑更新模版
function updateTemplet (data) {
  return ch.post(
    '/platform-extend/doctor/thcPageHeadTemplateConfig/modifyConfig',
    data
  )
}

// 查询所有模版项
function getAllTemplate () {
  return ch.post('/platform-extend/doctor/thcPageHeadTemplateConfig/getAll')
}

// 删除
function deleteItem (id) {
  return ch.post('/platform-extend/doctor/thcPageHeadTemplateConfig/delete', { id })
}
// 获取选择框
function getBox (id) {
  return ch.post('/platform-extend/doctor/thcPageHeadConfig/getAll')
}
function addTemplate (data) {
  return ch.post('/platform-extend/doctor/thcPageHeadTemplateConfig/insert', data)
}
export default {
  getCheckBox,
  getSysTypeInfoList,
  updateTemplet,
  getAllTemplate,
  deleteItem,
  getBox,
  addTemplate
}
