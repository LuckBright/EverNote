import {arrange as axios} from './api'
const url = '/arrange/'

function getLastTenArrangeList (params) {
  return axios.post(url + 'resourceArrange/getLastTenArrangeList', params)
}
export default {
  getLastTenArrangeList
}
