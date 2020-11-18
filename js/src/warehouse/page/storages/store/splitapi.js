// 物资拆零api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'splitNumber/'

function getBySpu (params) {
  return axios.post(url + 'getSplitMaterialInfoBySpu/', params).then(result => {
    return result
  })
}
function create (params) {
  return axios.post(url + 'createSplitNumberAndItem/', params).then(result => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getSplitNumberList/', params)
}
function getById (splitNumberId) {
  return axios.post(url + 'getSplitNumberAndItemInfo/', { splitNumberId }).then(result => {
    return result
  })
}

export default {
  getBySpu,
  list,
  getById,
  create
}
