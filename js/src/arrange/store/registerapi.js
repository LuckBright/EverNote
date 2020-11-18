import { arrange as axios } from './api'
const url = '/arrange/'

function getArrangeDepts (params) {
  return axios.get(url + 'appoint/arrangeInstance/searchDeptByDate/', {params})
}

export default {
  getArrangeDepts
}
