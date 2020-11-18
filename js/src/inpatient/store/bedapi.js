import {inpatient as axios} from './sobapi'
const url = '/sob/'

// 包床列表查询
function getBedsByWard (data) {
  return axios({
    url: '/workbench/hospitalizedEntranceMsg/getBedsByWard',
    method: 'post',
    data: data
  })
}

// 包床
function createOccupyBeds (data) {
  return axios({
    url: '/workbench/hospitalizedEntranceMsg/createOccupyBeds',
    method: 'post',
    data: data
  })
}

// 换床
function changeBed (data) {
  return axios({
    url: '/sob/hospitalizedEntranceMsg/changeBed',
    method: 'post',
    data: data
  })
}

function list (params) {
  return axios.post(url + 'hospitalizedBed/search', params).then(result => {
    return {
      list: result.list.bedList,
      totalCount: result.totalCount,
      freeBeds: result.list.freeBeds
    }
  })
}

function getFree (params) {
  return axios.post(url + 'hospitalizedBed/search', params).then(result => {
    return result
  })
}

export default {
  list,
  getFree,
  createOccupyBeds,
  changeBed,
  getBedsByWard
}
