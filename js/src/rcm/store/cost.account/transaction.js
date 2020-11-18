import axios from '../api'

function del (id) {
  return axios.post('ic/inventoryDeal/delete', {
    id: id
  })
}

function list (params) {
  return axios.post('ic/inventoryDeal/getInventoryDeal', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function createOrUpdate (params) {
  return axios.post('ic/inventoryDeal/createInventoryDeal', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function geActivityTypeList (params) {
  return axios.post('activity/geActivityTypeList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  list,
  createOrUpdate,
  geActivityTypeList,
  del
}
