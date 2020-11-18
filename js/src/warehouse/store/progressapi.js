import { progress as axios } from './api-process'
const url = 'history/'

function list (params) {
  return axios.post(url + 'task/log/', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function listed (params) {
  return axios.post(url + 'task/log/byBusinessCode', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function tasklist (params) {
  return axios.post('task/', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function getlist (params) {
  return axios.post('task/get/handler', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function finish (params) {
  return axios.post('task/finish', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function rollback (params) {
  return axios.post('task/rollback', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function taskInfo (params) {
  return axios.post('task/taskInfo', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}
export default {
  list,
  tasklist,
  listed,
  finish,
  rollback,
  getlist,
  taskInfo
}
