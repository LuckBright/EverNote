import { warehouse as axios } from '../../store/api'
const url = 'inStock/'

function getById (inStockId) {
  return axios.post(url + 'getInStockAndItemInfo/', { inStockId }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateInStockAndItemForEdit' : 'createInOutStock'
  return axios.post(url + path + '/', obj)
}

function create (obj) {
  return axios.post(url + 'createNewInStock/', obj)
}

async function list (params) {
  return await axios.post(url + 'getInStockList/', params)
    .then((response) => {
      if (!response.list) {
        return []
      } else {
        return response
      }
    })
}

export default {
  getById,
  createOrUpdate,
  list,
  create
}
