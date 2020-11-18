import req from '@/util/req'
import urlMap from '@/util/urls'
function getConfig (params) {
  return req.get(urlMap.getTableConfig, params)
}
function getStaticConfig (url) {
  return req.get(url)
}
function saveConfig (params) {
  return req.post(urlMap.saveTableConfig, params)
}
function savePageSize (params) {
  return req.post(urlMap.saveTablePageSize, params)
}
function getData (url, params, method = 'post', request = 'request') {
  return req[request](url, params, method)
}

export default {
  getConfig,
  getStaticConfig,
  saveConfig,
  savePageSize,
  getData,
}
