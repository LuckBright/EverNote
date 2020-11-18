import {card as axios} from './api'

const url = 'giftcard/'

function getById (id) {
  return axios.get(url + 'getPageByBatchId/', {params: {
    batchId: id
  }}).then(result => {
    var obj = result.data
    return obj
  })
}

function del (id) {
  return axios.get(url + 'delete', {params:
  {
    id: id
  }})
  .then((response) => {
    return response
  })
}

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      return response.data
    })
}

function getByUser (patientId) {
  return axios.get(url + 'getNotUseByPatientId', {
    params: {
      patientId
    }
  })
}

// 冻结
function freeze (id) {
  let params = {
    id: id,
    updator: 2,
    updatorName: '大爷的'
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'freeze', params)
  .then((response) => {
    return response
  })
}

// 解冻
function unfreeze (id) {
  let params = {
    id: id,
    updator: 2,
    updatorName: '大爷的'
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'unfreeze', params)
  .then((response) => {
    return response
  })
}

// 作废
function discard (id) {
  let params = {
    id: id
  }
  params = axios.jsonToFormEncoded(params)

  return axios.post(url + 'discard', params)
  .then((response) => {
    return response
  })
}

function bind (patientId, id) {
  return axios.post(url + 'bind', axios.jsonToFormEncoded({
    patientId,
    id
  })
  )
}

function checkCodeExist (params) {
  params = axios.jsonToFormEncoded(params)
  return axios.get(url + 'checkCodeExist/', {params: params})
    .then((response) => {
      return response
    })
}

export default {
  getById,
  del,
  list,
  getByUser,
  checkCodeExist,
  freeze,
  unfreeze,
  discard,
  bind
}
