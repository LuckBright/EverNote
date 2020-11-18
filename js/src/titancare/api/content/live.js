import { getInstance } from '../api'

const axios = getInstance()

let urlDoc = '/titan-doctor/'
let urlCms = '/titan-cms/'

// 获取住户名称
function getOrgListByConditio (params) {
  return axios.post(`${urlCms}platformCore/v1.1/out/organization/getOrgListByCondition`, params)
}
// 创建直播
function liveCreateLiveRecord (params) {
  return axios.post(`${urlDoc}v4.1/live/createLiveRecord`, params)
}

// 编辑直播
function updateLiveRecord (params) {
  return axios.post(`${urlDoc}v4.1/live/updateLiveRecord`, params)
}

// 查询获取科室列表
function getTenantSubjectListByCondition (params) {
  return axios.post(`${urlCms}platformCore/v1.1/out/subject/getTenantSubjectListByCondition`, params)
}

// 查询医生职称
function getValueListBySetCode (params) {
  return axios.post(`${urlCms}platformCore/v1.0/valueSet/getValueListBySetCode`, params)
}

// 查询医生列表
function getStaffListHasOrgHasSubjectByCondition (params) {
  return axios.post(`${urlCms}platformCore/v1.1/out/staff/getStaffListHasOrgHasSubjectByCondition`, params)
}

// 查询直播列表
function getLiveRecordList (params) {
  return axios.post(`${urlDoc}v4.1/live/getLiveRecordList`, params)
}
// 健康直播配置--查询
function searchLiveConfByOrgId (params) {
  return axios.post(`${urlDoc}v4.1/live/searchLiveConfByOrgId`, params)
}
// 健康直播配置--保存
function updateLiveConf (params) {
  return axios.post(`${urlDoc}v4.1/live/updateLiveConf`, params)
}

// 结束直播
function endLive (params) {
  return axios.get(`${urlDoc}v4.1/live/endLive?id=` + params)
}

// 获取im签名
function getSig () {
  return axios.get(`${urlDoc}v4.1/live/getLiveUserForDoctor`)
}

// 获取直播时长及观看人数
function getDurationAndNumberOfViewers (params) {
  return axios.get(`${urlDoc}v4.1/live/getDurationAndNumberOfViewers?id=${params.id}`)
}
// 列表
function getLiveMailInfo () {
  return `${urlDoc}v4.1/live/getLiveMailInfo`
}

// 获取禁言和状态
function getMaskKeywords (params) {
  return axios.get(`${urlDoc}v4.1/live/getMaskKeywords?id=${params.id}`)
}

// 保存禁言信息
function updateMaskKeywords (params) {
  return axios.post(`${urlDoc}v4.1/live/updateMaskKeywords`, params)
}

// 查询流状态
function getWhetherLiveing (params) {
  return axios.get(`${urlDoc}v4.1/live/getWhetherLiveing?streamName=${params.streamName}`)
}

// 取消置顶
function placeDown (params) {
  return axios.get(`${urlDoc}v4.1/live/placeDown?id=${params.id}`)
}

// 置顶
function placeTop (params) {
  return axios.get(`${urlDoc}v4.1/live/placeTop?id=${params.id}`)
}

// 获取配置带货列表
function searchLiveGoods (params) {
  return axios.post(`${urlDoc}v4.1/live/searchLiveGoods`, params)
}

// 添加推荐商品
function batchAddLiveGoods (params) {
  return axios.post(`${urlDoc}v4.1/live/batchAddLiveGoods`, params)
}

// 移除商品
function deleteLiveGoodsById (params) {
  return axios.post(`${urlDoc}v4.1/live/deleteLiveGoodsById`, params)
}

// 获取销售总额和数量
function liveSale (params) {
  return axios.get('/titan-mall/third/order/report/live/sale?liveId=' + params.liveId)
}

// 获取带货商品图片cdn
// function authToken (params) {
//   return axios.get(`${urlCms}/base/auth/token`, params.config)
// }

export default {
  getOrgListByConditio,
  liveCreateLiveRecord,
  updateLiveRecord,
  getTenantSubjectListByCondition,
  getValueListBySetCode,
  getStaffListHasOrgHasSubjectByCondition,
  getLiveRecordList,
  searchLiveConfByOrgId,
  updateLiveConf,
  endLive,
  getDurationAndNumberOfViewers,
  getMaskKeywords,
  updateMaskKeywords,
  getWhetherLiveing,
  placeDown,
  placeTop,
  searchLiveGoods,
  batchAddLiveGoods,
  deleteLiveGoodsById,
  liveSale,
  // authToken,
  getSig,
  getLiveMailInfo
}
