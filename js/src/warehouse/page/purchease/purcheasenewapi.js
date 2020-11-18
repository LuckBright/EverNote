import { warehouse as axios } from '../../store/api'
const url = 'purchaseOrder/'

function createOrUpdate (params) { // 提交 暂存采购单
  let path = 'createNewPurchaseOrder'
  return axios.post(url + path + '/', params)
}

function updateNewPurchaseOrder (params) { // 取消采购单
  return axios.post(url + 'updateNewPurchaseOrder/', params)
}

async function list (params) {
  return await axios.post(url + 'getNewPurchaseOrderList/', params)
}

function getById (id) {
  return axios.post(url + 'getNewPurchaseOrderInfo/', id).then((result) => {
    return result
  })
}

export default {
  getById,
  list,
  createOrUpdate,
  updateNewPurchaseOrder
}
