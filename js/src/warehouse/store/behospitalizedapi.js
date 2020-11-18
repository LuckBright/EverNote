import { workspace as axios } from '@/workspace/store/api'
import { diction } from '@/store/common'
const url = diction.gapi + '/c-drug/doctor/'

function getById (stdId) {
  return axios.get(url + 'stdDrug/getByStdId', {
    params: {
      stdId
    }
  }).then(result => {
    return result
  })
}

function list (params) {
  return axios.get(url + 'org/stdDrug/search', {
    params: params
  }).then(result => {
    result.totalCount = result.data.totalCount
    return result
  })
}

function createOrUpdate (params) {
  return axios.post(url + 'org/drug/create', params).then(result => {
    return result
  })
}

function submit (params) {
  return axios.post(url + 'updateSubmit/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  list,
  createOrUpdate,
  submit
}
