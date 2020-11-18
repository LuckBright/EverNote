import req from '@/util/req'
const url = 'thc-platform-core/frequency/'
function list (params) {
  return req.post(url + 'getFrequencys', params)
    .then(response => {
      return response
    })
}

function createOrUpdate (obj) {
  let path = obj.id ? 'updateFrequency' : 'createFrequency'
  return req.post(url + path + '/', obj)
}

function getById (id) {
  return req.post(url + 'getFrequency', {id})
    .then(result => {
      if (result && result.data) {
        result.data.isValid = '' + result.data.isValid
        return result.data
      } else {
        return {}
      }
    })
}

function del (id) {
  return req.post(url + 'removeFrequency/', {id})
}

export default {
  list,
  del,
  createOrUpdate,
  getById
}
