import { warehouse as axios } from '@/warehouse/store/api'
const url = '/material/'

async function list (params) {
  return await axios.post(url + 'tenantSpuList/', params)
}
function relationloal (params) {
  return axios.post(url + 'saveRelation/', params).then(result => {
    return result
  })
}

export default {
  list,
  relationloal
}
