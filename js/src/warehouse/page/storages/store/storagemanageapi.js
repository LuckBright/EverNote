// 库房预警设置api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'stockAmount/'

function create (obj) {
  return axios.post(url + 'createStockAmount/', obj)
}

// 新版库存预警保存
function createStockAmountSave (params) {
  return axios.post(url + 'createStockAmountList/', params)
}

function update (obj) {
  return axios.post(url + 'updateStockAmount/', obj)
}

async function list (params) {
  return await axios.post(url + 'getStockAmountList/', params)
    .then((response) => {
      if (!response.list) {
        return []
      } else {
        return response
      }
    })
}

function getNowNum (id) {
  return axios.post(url + 'getNowSetAmount/', {
    storageRoomId: id
  }).then((result) => {
    return result
  })
}

export default {
  list,
  create,
  update,
  getNowNum,
  createStockAmountSave
}
