import { warehouse as axios } from '../../store/api'
const url = 'outStock/'

function getById (outStockId) {
  return axios.post(url + 'getOutStockAndItemInfo/', {
    outStockId
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateOutStockAndItemForEdit' : 'createOutStock'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getOutStockList/', params)
    .then((response) => {
      if (!response.list) {
        return []
      } else {
        return response
      }
    })
}

function stocklist (params) {
  return axios.post(url + 'getStockContainerForBatchNumList/', params)
}

export default {
  getById,
  createOrUpdate,
  list,
  stocklist
}
