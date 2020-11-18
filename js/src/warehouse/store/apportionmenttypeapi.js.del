import axios from '@/insurance/store/api'
const url = '/rcm/api'

async function list (params) {
  return await axios.post(url + '/apportionType/search', params)
}
function del (params) {
  return axios.post(url + '/apportionType/delete', params).then(result => {
    return result
  })
}
function addapportionType (params) {
  return axios.post(url + '/apportionType/create', params).then(result => {
    return result
  })
}
function editapportionType (params) {
  return axios.post(url + '/apportionType/update', params).then(result => {
    return result
  })
}
export default {
  list,
  del,
  addapportionType,
  editapportionType
}
