/**
 * @Description: urlMap
 * @author fuyongbo@everjiankang.com
 * @date 2019-04-11
*/
/* mock文件存放的默认地址 这里的文件在线上环境是可以删除的 */
// export const staticPath = 'static/assets/mock/'
/* 请求前缀 根据需要划分级别 */
export const prefix = {
  cms: '/titan-cms/',
  password: '/titan-sso/',
  open: '/titan-open/',
  member: '/titan-member/',
  doc: '/titan-doctor/',
  mall: '/titan-mall/',
}

const urlMap = {
  // 医生团队设置
  team: {
    search: { url: 'team/search', isStatic: false, prefix: prefix.cms },
  },
  // 允许医生在问诊时推荐商品
  config: {
    getGoodsAllow: { url: 'config/getGoodsAllow', isStatic: false, prefix: prefix.cms },
    createOrUpdateGoodsAllow: { url: 'config/createOrUpdateGoodsAllow', isStatic: false, prefix: prefix.cms },
  },
  // 日报相关
  daily: {
    getDailyPushList: { url: 'daily/getDailyPushList', isStatic: false, prefix: prefix.member }, // 获取列表
    createDailyPushAccount: { url: 'daily/createDailyPushAccount', isStatic: false, prefix: prefix.member }, // 新增
    deleteDailyPushById: { url: 'daily/deleteDailyPushById', isStatic: false, prefix: prefix.member }, // 删除
    scheduledDaily: { url: 'send/scheduledDaily', isStatic: false, noSlash: true, prefix: prefix.member }, // 给单个用户发送日报
  },
  // 直播相关
  live: {
    getLiveRecordList: { url: 'v4.1/live/getLiveRecordList', isStatic: false, prefix: prefix.doc }, // 查询直播列表
    getLiveUserForDoctor: { url: 'v4.1/live/getLiveUserForDoctor', isStatic: false, prefix: prefix.doc }, // 返回im用户签名等信息
    getImParams: { url: 'counsel/getImParams', isStatic: false, noSlash: true, prefix: prefix.cms }, // 返回医生端获取im用户签名等信息
  },
  // 权限相关
  auth: {
    token: { url: 'base/auth/token', isStatic: false, prefix: prefix.cms }, // 返回token
  },
  // 预问诊模板相关
  preConsultation: {
    search: { url: 'preConsultation/search', isStatic: false, prefix: prefix.cms, noSlash: true }, // 查询预问诊模版
    deleteById: { url: 'preConsultation/deleteById', isStatic: false, prefix: prefix.cms, noSlash: true }, // 删除预问诊模版
  },
  // 处方相关
  recipeOrder: {
    getElectronicRecipe: { url: 'recipeOrder/v1.1/getElectronicRecipe', isStatic: false, prefix: prefix.cms, noSlash: true }, // 获取电子处方
  },
}

export default urlMap

