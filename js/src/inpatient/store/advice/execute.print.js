import { inpatient as axios } from '../sobapi'
const url = '/sob/inpatientController/'

// 查询执行单列表
function queryExecuteAdviceListForPrint (params) {
  return axios.post(url + 'queryExecuteAdviceListForPrint', params).then(res => {
    return formatData(res, params.isAll)
  })
}

// 查询瓶贴列表
function queryBottlePaperList (params) {
  return axios.post(url + 'queryBottlePaperList', params).then(res => {
    return formatData(res, params.isAll)
  })
}

// 查询输液卡列表
function queryInfusionCardList (params) {
  return axios.post(url + 'queryInfusionCardList', params).then(res => {
    return formatData(res, params.isAll)
  })
}

// 处理数据
function formatData (res, isAll) {
  if (res.data) {
    if (isAll) {
      return {
        list: res.data || [],
        totalCount: 0
      }
    }
    return {
      list: res.data.resultList || [],
      totalCount: res.data.totalCount || 0
    }
  }
  return {
    list: [],
    totalCount: 0
  }
}
/**
 * 打印完成上传打印记录
 * @param {executeIdList, code, printBy} params
 * code SHU_YE_KA,FEN_LEI_ZHI_XING_DAN,PING_TIE
 */
function addExecutePrintRecord (params) {
  return axios.post('/sob/executePrintRecord/addExecutePrintRecord', params).then(res => {
    console.log(res)
  })
}

export default {
  queryExecuteAdviceListForPrint,
  queryBottlePaperList,
  queryInfusionCardList,
  addExecutePrintRecord
}
