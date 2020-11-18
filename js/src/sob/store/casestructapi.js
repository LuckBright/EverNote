import {workspace as axios} from '../../workspace/store/api'
let url = 'phr-service/doctor/medicalRecordStruct/'

function createOrUpdate (struct) {
  let action = struct.id ? 'modify' : 'create'
  let params = Object.assign({}, struct)
  params.content = params.struct && params.struct.join(',')
  params.dptIds = params.dptIds && params.dptIds.join(',')
  delete params.struct
  return axios.post(url + action, params)
}

function getById (id) {
  return axios.get(url + 'getById', {
    params: {
      id
    }
  }).then(result => {
    let obj = result.data
    obj.dptIds = obj.dptIds.split(',')
    obj.struct = obj.content.split(',')
    return obj
  })
}

function list (params) {
  params.name = params.name || ''
  return axios.get(url + 'search', {
    params
  }).then(result => {
    return result.data
  })
}

function del (id) {
  return axios.post(url + 'delete', axios.jsonToFormEncoded({id}))
}

function getDisabledDepts (id) {
  return axios.get(url + 'getExistDptIds', {
    params: {
      id
    }
  })
}

function getByDept (dptId) {
  return axios.get(url + 'getByOrigIdAndDptId', {
    params: {
      dptId
    }
  })
}

export default {
  createOrUpdate,
  getById,
  list,
  del,
  getDisabledDepts,
  getByDept
}
