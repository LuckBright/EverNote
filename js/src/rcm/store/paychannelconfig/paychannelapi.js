import fetch from '../api'
import {diction} from '@/store/common'
const url = diction.api
const payurl = url + '/rcm/common/config'
function getPaychannelList (data) {
  return fetch({
    url: `${payurl}/searchCiphers`,
    method: 'post',
    data: data
  })
}
function getById (id) {
  return fetch({
    url: `${payurl}/getCipher`,
    method: 'post',
    data: {id: id}
  }).then(result => {
    // 返回时，将匿名的备份显示出来
    result.data.privateKeyCopy = result.data.privateKey.replace(/./g, '*')
    return result.data
  })
}
function createOrUpdate (data) {
  let createOrUpate = data.id ? '/updateCipher' : '/createCipher'
  return fetch({
    url: `${payurl}${createOrUpate}`,
    method: 'post',
    data: data
  })
}
function deleteById (id) {
  return fetch({
    url: `${payurl}/deleteCipher`,
    method: 'post',
    data: {id: id}
  })
}
export default {
  list: getPaychannelList,
  getById,
  createOrUpdate,
  del: deleteById
}
