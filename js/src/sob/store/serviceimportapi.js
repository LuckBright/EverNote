import {sob as axios} from './api'
const url = 'service/'

// 上传文件
function getById (id) {
  return axios.post(url + 'getServiceSetInfo/', {
    id
  }).then(result => {
    result.data.isValid = '' + result.data.isValid
    return result.data
  })
}

// 提交数据
function postData (obj) {
  var path = 'importService'
  return axios.post(url + path + '/', obj)
}

export default {
  getById,
  postData
}
