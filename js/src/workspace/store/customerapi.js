import {workspace as axios} from './api'
import {diction} from '@/store/common'
const url = diction.api + '/c-union/'

function getById (origId) {
  return axios.get(url + 'doctor/patient/getPageByOrigId/', {
    params: {
      origId: origId,
      needIden: true
    }
  }).then(result => {
    return result
  })
}

function del (id) {
  return axios.post(url + 'updateBloc/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  // params.pagesize = 30
  return axios.get(url + 'doctor/patient/search', {
    params: params
  }).then(result => {
    result.totalCount = result.data.totalCount
    return result
  })
}

export default {
  del,
  list,
  getById,
  diction
}
