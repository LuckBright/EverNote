import {mall as axios} from '../../card/store/passportapi'
const url = 'returnGoods/'

function getById (id) {
  return axios.get(url + 'getById', {params: {
    id: id
  }}).then(result => {
    return result
  })
}

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      return response
    })
}

export default {
  list,
  getById
}
