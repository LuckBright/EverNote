
// 科室

// 就诊类型
export const VISIT_TYPE = [
  {id: 1, name: '住院'},
  {id: 2, name: '门诊'},
  {id: 3, name: '急诊'},
  {id: 4, name: '体检'}
]
// 报告卡分类
export const REPORT_TYPE = [
  {id: 1, name: '传染病'},
  {id: 2, name: '院感'}
]

// 跳转获取通用的url
export function getQueryUrl (params) {
  if (!params) return {}
  let query = {}
  let queryArr = ['patientId', 'patientName', 'hospitalizedNumber', 'providerId', 'providerName', 'bedId', 'bedName', 'doctorId', 'status', 'areaId', 'areaName']
  if (!params.areaId) {
    let area = localStorage.getItem('inpatientKey')
    if (area) {
      [params.areaId, params.name] = area.split(',')
    }
  }
  queryArr.forEach(item => {
    if (params[item] === null || params[item] === undefined) {
      return
    }
    query[item] = params[item]
  })
  return query
}
