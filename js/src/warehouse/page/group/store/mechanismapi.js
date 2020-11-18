import { warehouse as axios } from '../../../store/api'
const url = 'clinicRecord/'

function createOrUpdate (obj) {
  var path = obj.id ? 'getSourceByUpdateClinicRecord' : 'getSourceCreateClinicRecordForSY'
  obj.architectureType = 121 // 维持老逻辑添加一个机构节点类型吧 不太清楚有啥用 2019-07-10
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getClinicRecordList/', params)
}

function getById (id) {
  return axios.post(url + 'getSourceByClinicRecordInfo/', { id }).then(result => {
    return result
  })
}

export default {
  createOrUpdate,
  list,
  getById
}
