import axios from '@/rcm/store/api'
const url = '/cashier/selfFeeDiscounts/'

function del (id) {
  return axios.post(url + 'delete', {
    id: id
  })
}

function list (params) {
  return axios.post(url + 'getSelfFeeDiscountsList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  list,
  del
}
