import { warehouse as axios } from './api'
const url = 'apply/'

function getById (id) {
  return axios.post(url + 'getApplyInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (params) {
  var path = params.id ? 'updateApply' : 'createApplyList'
  return axios.post(url + path + '/', params)
}

function del (id) {
  return axios.post(url + 'updateApply/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getApplyList/', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function updateNum (params) {
  return axios.post(url + 'getShowNum/', params).then(result => {
    return result
  })
}

function submit (params) {
  return axios.post(url + 'updateSubmitApply/', params).then(result => {
    return result
  })
}

function audit (params) {
  return axios.post(url + 'updateAuditApply/', params).then(result => {
    return result
  })
}

function handle (id) {
  return axios.post(url + 'updateHandleApply/', { id }).then(result => {
    return result
  })
}

function notify (id) {
  return axios.post(url + 'updateNoticApply/', { id }).then(result => {
    return result
  })
}

function confirm (id) {
  return axios.post(url + 'updateConfirmApply/', { id }).then(result => {
    return result
  })
}

function backOutOf (id) {
  return axios.post(url + 'updateReturnApply/', { id }).then(result => {
    return result
  })
}

export default {
  updateNum,
  getById,
  createOrUpdate,
  del,
  list,
  submit,
  audit,
  handle,
  notify,
  confirm,
  backOutOf
}
