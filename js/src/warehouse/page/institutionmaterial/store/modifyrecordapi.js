import { warehouse as axios } from '@/warehouse/store/api'
const url = '/basesource/'

async function list (params) {
  return await axios.post(url + 'getSourceByLocalSettingList/', params)
}

export default {
  list
}
