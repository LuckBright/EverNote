import axios from '@/insurance/store/api'
const url = '/rcm/pay'
const baseurl = '/rcm'

function list (params) {
  return axios.post(url + '/payment', params).then(result => {
    return result
  })
}
function update (params) {
  return axios.post(url + '/update', params).then(result => {
    return result
  })
}
function create (params) {
  return axios.post(url + '/create', params).then(result => {
    return result
  })
}
function updateAll (params) {
  return axios.post(url + '/updateAll', params).then(result => {
    return result
  })
}
// 获取场景下已勾选的支付方式
function getPaymethodsChecked (params) {
  return axios.post(baseurl + '/charge/method/getListByScene', params)
}
// 保存场景的默认支付方式及蓝色可点击支付方式
function saveDefaultPaymethod (params) {
  return axios.post(baseurl + '/charge/method/setSceneConfig', params).then(result => {
    return result
  })
}
export default {
  list,
  update,
  create,
  updateAll,
  getPaymethodsChecked,
  saveDefaultPaymethod
}
