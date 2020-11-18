import { warehouse as axios } from './api'
const url = 'activity/'
function getById (id) {
  return axios.post(url + 'getActivityTypeInfo/', {
    id: id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'createActivityType' : 'updateActivityType'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateActivityType/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'geActivityTypeList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
