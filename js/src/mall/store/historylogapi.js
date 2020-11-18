import {mall as axios} from '../../card/store/passportapi'
const url = 'productHistory/'

function list (id) {
  let param = axios.jsonToFormEncoded({productId: id})
  return axios.get(url + 'getByProductId', {params: param})
    .then((response) => {
      return response
    })
}

export default {
  list
}
