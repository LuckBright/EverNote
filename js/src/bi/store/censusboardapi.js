
import axios from '@/insurance/store/api'

function getDeptDoctorItemClassFeeSum (params) { // 吉林医保报表按收费项统计查询-门诊
  return axios.post('/rcm/ar/settlement/getDeptDoctorItemClassFeeSum', params).then((response) => {
    return response
  })
}
function getAllValueSetCodeNameMap (params) {
  return axios.post('/rcm/baseCommon/getAllValueSetCodeNameMap', params).then((response) => {
    return response
  })
}
export default {
  getAllValueSetCodeNameMap,
  getDeptDoctorItemClassFeeSum
}
