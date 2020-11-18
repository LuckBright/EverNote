// 库存查询api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'stockContainer/'

async function list (params) {
  return await axios.post(url + 'queryStockForList/', params)
}

export default {
  list
}
