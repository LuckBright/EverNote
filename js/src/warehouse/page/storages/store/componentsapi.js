import {warehouse as axios} from '@/warehouse/store/api'
function getBillNum (params) {
  return axios.post('inStock/getVerificationnvoiceNo/', params).then(result => {
    return result
  })
}
export default {
  getBillNum
}
