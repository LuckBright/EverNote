// 商品流向查询api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'materialFlow/'

async function list (params) {
  return await axios.post(url + 'getMaterialFlowList/', params)
}

export default {
  list
}
