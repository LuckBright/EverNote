
import { base as axios } from './baseapi'
const url = 'thc-queue/doctor/'

// 获取所有大屏list
function list (params) {
  return axios.post(url + 'waitingScreen/getBySnOrName', params).then(res => {
    if (res.head.errCode === 0 && res.data && res.data.resultList && res.data.resultList.length) {
      res.data.resultList.forEach((item, index) => {
        item.suitRoom = []
        if (item.clinics && item.clinics.indexOf(']') > 0 && JSON.parse(item.clinics).length) {
          JSON.parse(item.clinics).forEach((h, k) => {
            item.suitRoom.push(h.name)
          })
        }
        item.suitRoom = item.suitRoom.length ? item.suitRoom.join(',') : '--'
      })
    }
    return res
  })
}

// 删除大屏数据
function deleteScreen (params) {
  return axios.post(url + 'waitingScreen/delete', params)
}

// 获取thc所有诊间list
function getThcRoomList () {
  return axios.post(url + 'arrange/getClinicRoomList')
}

// 获取pacs所有诊间list
function getPacsRoomList () {
  return axios.post(url + 'arrange/getCheckRoomList')
}

// 获取已有的大屏信息
function getScreenInfo (params) {
  return axios.get(url + 'waitingScreen/getById', { params: params })
}

// 新增大屏信息
function createScreen (params) {
  return axios.post(url + 'waitingScreen/create', params)
}

// 更新大屏信息
function updateScreen (params) {
  return axios.post(url + 'waitingScreen/modify', params)
}

export default {
  list,
  deleteScreen,
  getThcRoomList,
  getPacsRoomList,
  getScreenInfo,
  createScreen,
  updateScreen
}
