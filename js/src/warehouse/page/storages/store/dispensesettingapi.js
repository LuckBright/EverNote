import { warehouse as axios } from '@/warehouse/store/api'
const url = '/dispenseSetting'
function getDispenseSettingList (params) {
  return axios.post(url + '/getDispenseSettingList/', params)
}
function updateDispenseSetting (params) {
  return axios.post(url + '/updateDispenseSetting/', params)
}
function getByDispensePrintSetting (storageRoomId) {
  return axios.post(url + '/getDispenseSettingByStorageRoomId/', { storageRoomId })
}

export default {
  getDispenseSettingList,
  updateDispenseSetting,
  getByDispensePrintSetting
}
