import { warehouse as axios } from '@/warehouse/store/api'
const url = 'process/'

// 库房流程明细修改
function updateProcessItem (params) {
  return axios.post(url + 'updateProcessItem/', params)
}

// 查询所有库房以及对应的机构id，name
function getAllStorageRoomAndClinic (params) {
  return axios.post(url + 'getAllStorageRoomAndClinic/', params)
}
// 查询所有库房以及对应的机构id，name
function checkCdssRule (params) {
  return axios.post('cdssRule/checkCdssRule', params)
}

export default {
  updateProcessItem,
  getAllStorageRoomAndClinic,
  checkCdssRule
}
