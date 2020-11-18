import {workspace as axios} from './api'

// 保存图片信息
function uploadImg (file, type) {
  var path = '/c-union/doctor/img/uploadImg'
  return axios.post(path, {
    photo: file
  })
}
export default {
  uploadImg
}
