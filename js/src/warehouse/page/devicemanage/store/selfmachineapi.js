import { base as axios } from './baseapi'

const url = 'thc-queue/doctor/'

// 获取所有自助机列表
function list (params) {
  return axios.post(url + 'selfMachine/getBySnOrName', params)
}

// 根据id删除自助机
function delSelfmach (params) {
  return axios.post(url + 'selfMachine/deleteSelfMachine', params)
}

// 获取所有抽血室列表
function getDrawBloodRoomList () {
  return axios.post(url + 'selfMachine/getBloodRoomList')
}

// 根据SN获取已有的信息
function getSelfMachInfoBySn (params) {
  return axios.post(url + 'selfMachine/querySelfMachineBySn', params)
}

// 新建自助机
function createSlefmachine (params) {
  return axios.post(url + 'selfMachine/addSelfMachine', params)
}

// 更新自助机
function updateSlefmachine (params) {
  return axios.post(url + 'selfMachine/updateSelfMachine', params)
}

export default {
  list,
  delSelfmach,
  getSelfMachInfoBySn,
  getDrawBloodRoomList,
  createSlefmachine,
  updateSlefmachine
}
