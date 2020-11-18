import { warehouse as axios } from './api'
const url = 'allotBound/'

function getById (id) {
  return axios.post(url + 'getAllotBoundInfo/', {
    id: id
  }).then(result => {
    return result
  })
}
function createOrUpdate (obj) {
  var path = obj.id ? 'updateAllotBound' : 'createAllotBoundForPurchase'
  return axios.post(url + path + '/', obj)
}
function create (obj) {
  var path = 'createAllotBoundForPurchase'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getAllotBoundList/', params)
}

export default {
  getById,
  createOrUpdate,
  // del,
  // updateGroup,
  list,
  create
}
