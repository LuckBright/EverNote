import { warehouse as axios } from '../../../store/api'
const url = 'sectionRecord/'

function createOrUpdate (obj) {
  var path = obj.id ? 'getSourceByUpdateSectionRecord' : 'getSourceCreateSectionRecordForSY'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getSectionRecordList/', params)
}

function getById (id) {
  return axios.post(url + 'getSourceBySectionRecordInfo/', { id }).then(result => {
    return result
  })
}

function del (id) {
  return axios.post(url + 'getSourceBySectionRecordDelete/', { id }).then(result => {
    return result
  })
}

export default {
  createOrUpdate,
  list,
  getById,
  del
}
