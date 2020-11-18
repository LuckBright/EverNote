// 套餐使用详情查询
import axios from '@/insurance/store/api'

function list (params) {
  return axios.post('/market/doctor/setmealOrder/getUseDetail/', params).then((response) => {
    return response
  })
}

export default {
  list
}
