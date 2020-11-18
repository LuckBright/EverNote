import { warehouse as axios } from '../../../store/api'
const url = '/pharmacologyCategory/'

// 药理分类树结构
async function oldlist (params) {
  return await axios.post(url + 'getPharmacologyCategoryList/', params)
}
// 药理分类树结构
async function list (params) {
  return await axios.post(url + 'getAllPharmacologyCategory/', params)
}

export default {
  list,
  oldlist
}
