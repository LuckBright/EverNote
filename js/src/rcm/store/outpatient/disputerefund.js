import axios from '../api'
// 查询列表
export function disputeRefundList (params) {
  return axios.post('disputeRefund/findList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
// 导出
export function exportFile (params) {
  return axios.post('disputeRefund/export', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
