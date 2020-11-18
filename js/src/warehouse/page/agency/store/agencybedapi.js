// 机构床位
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'hospitalBedRelation/'

function createOrUpdate (obj) {
  let path = obj.id ? '' : ''
  return axios.post(url + path + '/', obj)
}

export default {
  createOrUpdate
}
