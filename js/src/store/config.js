import { baseHost } from '@/store/basehost'
import { baseConfig } from '@/store/config.base'

var config = {}

config.host = baseHost.host + ''
config.mallHost = baseHost.mallHost + ''
config.api = baseHost.host + '/api'  // 新的请求地址
config.apiIh = baseHost.host + '/api-ih'  // 互联网医院请求地址
config.fileUrl = baseHost.host + '/api' // 文件存取接口前缀（域名+/api）
config.filePath = '/global-api/global-platform/phoneMapping/download?fileId=' // 上传之后的回显/下载地址
config.fileUrl2 = config.fileUrl + config.filePath
config.getClinicConfig = function () {
  // 查一下机构配置信息然后写到缓存备用
  let _getClinicObject = JSON.parse(localStorage.getItem('CLINICCONFIG'))
  let _res = Object.assign(baseConfig, _getClinicObject)
  // let _tenantData = JSON.parse(localStorage.getItem('TENANTDATA'))
  // if (_tenantData && _tenantData.navLogo) {
  //   _res.clinicSource.navLogo = _tenantData.navLogo
  // }
  return _res
}

export default config
