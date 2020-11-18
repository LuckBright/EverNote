import { warehouse as axios } from './api'
const url = 'activity/'

async function list (params) {
  return await axios.post(url + 'geActivityTypeList/', params)
}

export default {
  list
}
