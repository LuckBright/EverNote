// 进销存查询
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'inStock/'

function getByList (params) {
  return axios.post(url + 'getConditionInStockAndOutStockList/', params).then(result => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getInStockAndOutStockList/', params)
}

export default {
  getByList,
  list
}
