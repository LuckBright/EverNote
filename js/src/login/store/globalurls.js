const prefix = {
  globalInternal: 'global-api/global-platform/internal/',
  globalExtend: 'global-api/global-platform-extend/',
  globalTcm: 'global-api/global-platform/tcm/',
  globalPlatform: 'global-api/global-platform/'
}

export default {
  clinicset: {
    getWebConfig: { url: 'internal/tenant/getWebConfig', isStatic: false, prefix: prefix.globalPlatform },
    getKeyValueInfosDetails: { url: 'keyValueInfo/getKeyValueInfosDetails', isStatic: false, prefix: prefix.globalPlatform }
  },
  // internal模块
  internal: {
    getEnvId: { url: 'tc/env/getEnvId', isStatic: false, prefix: prefix.globalInternal }, // 获取互联网医院对应的域名
    getTenantsWithConfigs: { url: 'tenant/getTenantsWithConfigs', isStatic: false, prefix: prefix.globalInternal },
    getOrgInternetConfig: { url: 'tenant/getOrgInternetConfig', isStatic: false, prefix: prefix.globalInternal },
  },
  // 短信充值相关
  account: {
    getPayStatus: { url: 'tcm/manage/account/getPayStatus', isStatic: false, prefix: prefix.globalInternal },
    getAccount: { url: 'tcm/manage/account/get', isStatic: false, prefix: prefix.globalInternal },
    getAccountBillPageList: { url: 'tcm/manage/account/getAccountBillPageList', isStatic: false, prefix: prefix.globalInternal },
    getDetailGroupBillDate: { url: 'tcm/manage/account/getDetailGroupBillDate', isStatic: false, prefix: prefix.globalInternal },
    getDetailGroupOrg: { url: 'tcm/manage/account/getDetailGroupOrg', isStatic: false, prefix: prefix.globalInternal },
    getPriceByTenantIdAndType: { url: 'tcm/manage/account/getPriceByTenantIdAndType', isStatic: false, prefix: prefix.globalInternal },
    accountRecharge: { url: 'tcm/manage/account/recharge', isStatic: false, prefix: prefix.globalInternal },
  },
  // 对象存储phoneMapping
  phoneMapping: {
    multiUpload: { url: 'phoneMapping/multiUpload', isStatic: false, prefix: prefix.globalPlatform },
    uploadAndCreatePhoneInfo: { url: 'phoneMapping/uploadAndCreatePhoneInfo', isStatic: false, prefix: prefix.globalPlatform },
    download: { url: '/thc-platform-core/unify/download/', isStatic: false },
  },
  // 获取当前环境对应的环境id
  unify: {
    getEvnId: { url: '/thc-platform-core/unify/getEvnId', isStatic: false }, // 获取对应的环境id（打印到login页面html内，便于定位问题）
    getGlobalHost: { url: '/thc-platform-core/unify/getGlobalUrl', isStatic: false }, // 获取当前环境对应哪个global环境（打印到login页面html内，便于定位问题）
  },
  // 帮助中心
  help: {
    widgetGet: { url: 'help/app/widget/get', isStatic: false, prefix: prefix.globalExtend }, // 根据thc页面内的rid和version 获取帮助中心内容
    contentSearch: { url: 'help/app/content/search', isStatic: false, prefix: prefix.globalExtend }, // 根据关键字模糊搜索帮助中心列表
  },
  // 版本信息
  tenantData: {
    getByTenantId: { url: 'tenant-it-data/getByTenantId', isStatic: false, prefix: prefix.globalTcm },
  },
  // 上传视频到腾讯云点播获取签名接口
  tencentcloud: {
    getUploadSignature: { url: 'tencentcloud/getUploadSignature', isStatic: false, prefix: prefix.globalExtend },
  },
}
