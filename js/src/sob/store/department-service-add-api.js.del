import {sob} from './api'
const url = 'service/'

function list (params) {
  return sob.post(url + 'providerIsNull/', Object.assign({
    offset: 0,
    pagesize: 10
  }, params)).then((response) => {
    return response
  })
}

export default {
  list
}
