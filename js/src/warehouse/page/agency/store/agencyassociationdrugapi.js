// 机构药理分类
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'categoryMaterialRelation/'

function list (params) {
  return axios.post(url + 'getLocalSettingWithCategoryRelationList/', params)
}

async function getById (params) {
  return axios.post('/localSetting/getLocalSettingWithCategory/', params)
}

export default {
  list,
  getById
}
