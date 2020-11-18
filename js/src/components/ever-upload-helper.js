import axios from 'axios'
import diction from '@/store/common'
import storage from '@/util/storage'
import store from '@/store/index'
import globalUrlMap from '@/login/store/globalurls'

const url = diction.api + '/' + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.prefix + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.url

const ax = axios.create()
ax.interceptors.request.use(function (config) {
  config.headers['x-access-token'] = storage.getStorageByClinic('TOKEN')
  config.headers['Content-Type'] = 'multipart/form-data'
  config.headers['x-tenant-id'] = localStorage.getItem('TENANTID')
  config.headers['x-user-ip'] = localStorage.getItem('x-user-ip')
  return config
})
ax.interceptors.response.use(function (response) {
  return {
    ...response.data,
    ...(response.data.data ? { fileUrl: diction.fileUrl + response.data.data.fileUrl } : {})
  }
})

export function upload (file, isBase64 = false) {
  const formData = new FormData()
  formData.append('file', isBase64 ? convertBase64UrlToFile(file) : file)
  return ax.post(url, formData)
}
export function convertBase64UrlToFile (urlData) {
  const data = urlData.split(',')
  const mime = data[0].match(/:(.*?);/)[1]
  const bytes = window.atob(data[1])
  const l = bytes.length
  const u8arr = new Uint8Array(bytes.length)
  for (let i = 0; i < l; i++) {
    u8arr[i] = bytes.charCodeAt(i)
  }
  // const blob = new Blob([u8arr], {type: mime})
  // blob.lastModifiedDate = new Date()
  // blob.name = 'file'
  return new File([u8arr], `file.${mime.split('/')[1]}`, { type: mime })
}

// 把后端返回的sql字符串转化成sql文件下载下来
export function downloadSql (url, params, fileName) {
  store.commit('setPending', 1)
  axios({
    url: url,
    method: 'post',
    headers: {
      'x-access-token': localStorage.getItem('TOKEN'),
      'Content-Type': 'application/json;charset=UTF-8',
      'x-tenant-id': localStorage.getItem('TENANTID'),
      'x-user-ip': localStorage.getItem('x-user-ip'),
    },
    data: params
  }).then(res => {
    store.commit('setPending', -1)
    const blob = new Blob([res], {type: 'text/plain,charset=UTF-8'})
    let url = window.URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  })
}
