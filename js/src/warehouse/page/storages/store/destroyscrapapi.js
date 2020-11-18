// 销毁报废api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'destroyedNotice/'

async function list (params) {
  return await axios.post(url + 'getDestroyedNoticeList/', params)
}

function createOrUpdate (params) {
  var path = params.id ? 'submitDestroyedNotice' : 'createDestroyedNotice'
  return axios.post(url + path + '/', params)
}

function getById (id) {
  return axios.post(url + 'getDestroyedNoticeInfo/', id).then((result) => {
    return result
  })
}
function cancelDestroyedNotice (params) {
  return axios.post(url + 'cancelDestroyedNotice/', params).then((result) => {
    return result
  })
}

export default {
  list,
  createOrUpdate,
  getById,
  cancelDestroyedNotice
}
