import { workspace as axios } from '@/workspace/store/api'
const url = 'sob/finTypeMapping/'

function query (params) {
  return axios.post(url + 'query', params).then(response => {
    return response.data
  })
}
function save (params) {
  return axios.post(url + 'save', params).then(response => {
    return response.data
  })
}

function getByFinType (params) {
  return axios.post(url + 'getByFinType', params).then(response => {
    return response.data
  })
}

export default {
  query,
  save,
  getByFinType
}
