import {warehouse as axios} from '@/warehouse/store/api'
const url = 'jobAccount/'
const taskurl = 'switchConfig/'

function getInfo (params) {
  return axios.post(url + 'queryjobAccountInfo/', params)
}

function getTaskList () {
  return axios.post(taskurl + 'getSwitchConfigList/')
    .then((response) => {
      return response
    })
}
export default {
  getInfo,
  getTaskList
}
