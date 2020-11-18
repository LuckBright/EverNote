import rcm from './api'
const url = 'ap/purInvoice/'

function list (params) {
  return rcm.post(url + 'getPurInvoiceList', params).then(result => {
    return result
  })
}

export default {
  list
}
