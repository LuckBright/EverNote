import { warehouse as axios } from '../../store/api'
const url = 'apply/'
const urlSwitch = 'switchConfig/'

function getById (params) {
  return axios.post(url + 'getApplyInfo/', params)
}

function createOrUpdate (params) {
  var path = params.id ? 'updateApply' : 'createApply'
  return axios.post(url + path + '/', params)
}
// 领用单取消
function cancle (params) {
  return axios.post(url + 'rollBackApply/', params)
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

function updateSwitch (params) {
  return axios.post(urlSwitch + 'updateSwitchConfig/', params).then((response) => {
    return response
  })
}
// 领用单暂存
function temporaryStorage (params) {
  return axios.post(url + 'temporaryStorage/', params)
}

// 领用单提交
function submitApply (params) {
  return axios.post(url + 'submitApply/', params)
}

export default {
  updateSwitch,
  getById,
  createOrUpdate,
  cancle,
  list,
  temporaryStorage,
  submitApply
}
