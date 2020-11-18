import { warehouse as axios } from './api'
const url = 'stockContainer/'

async function list (params) {
  return await axios.post(url + 'queryStockForList/', params)
}
function checkBatch (params) {
  return axios.post(url + 'checkBatch/', params)
}

export default {
  list,
  checkBatch
}
