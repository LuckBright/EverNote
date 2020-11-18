import { warehouse as axios } from './api'
const url = 'supplierLocal/'

async function list (params) {
  return await axios.post(url + 'getSupplierLocalByClinic/', params)
}

export default {
  list
}
