import {inpatient as axios} from './sobapi'
const url = '/sob/'

// 获取换床人员信息方法
function getMessage (params) {
  return axios.post(url + 'entryProvider/getRecordByHosNum', params)
}

// 获取病床列表
function getBedlist (params) {
  return axios.post(url + 'hospitalizedBed/getBedListByAreaId', params)
}

// 换床
function changeBed (params) {
  return axios.post(url + 'entryProvider/changeBed', params)
}

export default {
  getMessage,
  getBedlist,
  changeBed
}

