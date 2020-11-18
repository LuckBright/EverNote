import { getInstance } from '../api'

const axios = getInstance()

let urlDoc = '/titan-doctor/'

export default {
  list (params) {
    return axios.post(`${urlDoc}v4.1/live/searchPlaybackRecordForTenant`, params)
  },
  del (params) {
    return axios.get(`${urlDoc}v4.1/live/deletePlaybackById`, { params })
  },
  waitingConsultList (params) {
    return axios.post(`${urlDoc}v4.1/live/waitingConsultList`, params)
  },
  getConsultingImUsers (params) {
    return axios.post(`${urlDoc}v4.1/live/getConsultingImUsers`, params)
  },
  consultedImUser (params) {
    return axios.post(`${urlDoc}v4.1/live/consultedImUser`, params)
  },
  removeImUserFromProhibitList (params) {
    return axios.post(`${urlDoc}v4.1/live/removeImUserFromProhibitList`, params)
  },
  addImUserToProhibitList (params) {
    return axios.post(`${urlDoc}v4.1/live/addImUserToProhibitList`, params)
  },
  recommendDoctorOneByOne (params) {
    return axios.post(`${urlDoc}v4.1/live/recommendDoctorOneByOne`, params)
  },
  exportChatHistory (params) {
    return `${urlDoc}v4.1/live/exportChatHistory`
  },
  exportMailInfo (params) {
    return axios.post(`${urlDoc}v4.1/live/exportMailInfo`, params)
  },
  recommendGoodsToRoom (params) {
    return axios.post(`${urlDoc}v4.1/live/recommendGoodsToRoom`, params)
  },
  recommendGoodsToImUser (params) {
    return axios.post(`${urlDoc}v4.1/live/recommendGoodsToImUser`, params)
  }
}
