import axios from './api'

/**
 * 获取成本计算参数列表
 * @param params
 * @param params.clinicId     医疗机构id
 * @param params.page         列表页码
 * @param params.pageSize
 */
function list (params) {
  return axios.post('ic/costParamSet/getcostParamList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  list
}
