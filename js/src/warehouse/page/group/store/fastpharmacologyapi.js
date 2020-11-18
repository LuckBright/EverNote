import { warehouse as axios } from '../../../store/api'
const url = '/categoryMaterialRelation/'

// 药理分类未关联列表
async function list (params) {
  return await axios.post(url + 'getMaterialSpuNotRelation/', params)
}
export default {
  list
}
