// 药理分类
import { warehouse as axios } from '../../../store/api'
const url = 'basesource/'

function list (params) {
  return axios.post(url + 'getSourceByClassify/', params)
}

export default {
  list
}
