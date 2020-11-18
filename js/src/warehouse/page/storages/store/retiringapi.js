// 业务退库api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'cancelStock/'

// 退库暂存
function temporarySave (params) {
  return axios.post(url + 'temporarySave/', params)
}

// 退库取消
function rollBackCancelStock (params) {
  return axios.post(url + 'rollBackCancelStock/', params)
}

// 退库提交
function createCalcelStock (params) {
  return axios.post(url + 'createCalcelStock/', params)
}

function getById (id) {
  return axios.post(url + 'getCalcelStockInfo/', id).then((result) => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getCancelStockList/', params)
}

export default {
  list,
  getById,
  temporarySave,
  createCalcelStock,
  rollBackCancelStock
}
