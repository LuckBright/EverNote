import { warehouse as axios } from '../../../store/api'
// 集团部门
const url = 'departmentRecord/'

function createOrUpdate (obj) {
  var path = obj.id ? 'getSourceByUpdateDepartmentRecord' : 'getSourceCreateDepartmentRecordForSY'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getDepartmentRecordList/', params)
}

function getById (id) {
  return axios.post(url + 'getSourceByDepartmentRecordInfo/', { id }).then(result => {
    return result
  })
}
// 删除部门
function modifyStatusDel (params) {
  return axios.post(url + 'updateDepartmentRecordMaster/', params).then(result => {
    return result
  })
}

export default {
  createOrUpdate,
  list,
  getById,
  modifyStatusDel
}
