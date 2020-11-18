import { getInstance } from '../api'
import { prefix } from '@/titancare/utils/urls'
import config from '@/titancare/store/config'

const axios = getInstance()

// 获得图片基本路径url
function getFileUrl () {
  return axios.get(`${prefix.cms}getFileUrl`)
}

// 获取租户和租户配置信息（按ID查询）
function getWebConfig (params) {
  return axios.get(config.thcApi + '/global-api/global-platform/internal/tenant/getWebConfig', { params })
}

export default {
  getFileUrl,
  getWebConfig
}
