import {crm as axios} from './api'
// const url = 'c-union/'

// 是否能进行编辑
function lock (params) {
  return axios.post('blackboard/lock', params)
}

// 是否能进行编辑
function unlock (params) {
  return axios.post('blackboard/unlock', params)
}

// 保存小黑板文本编辑器内容
function createMsg (params) {
  return axios.post('blackboard/createMsg', params)
}

// 获取小黑板内容
function getMsg (params) {
  return axios.get('blackboard/getMsg', {params: params})
    .then((response) => {
      return response
    })
}

// 添加todolist
function createRichMsg (params) {
  return axios.post('blackboard/createRichMsg', params)
}

// 更新todolist
function modifyRichMsg (params) {
  return axios.post('blackboard/modifyRichMsg', params)
}

// 删除todolist
function deleteRichMsg (params) {
  return axios.post('blackboard/deleteRichMsg', params)
}

// 任务完成
function finishRichMsg (params) {
  return axios.post('blackboard/finishRichMsg', params)
}

export default {
  lock,
  unlock,
  createMsg,
  getMsg,
  createRichMsg,
  modifyRichMsg,
  deleteRichMsg,
  finishRichMsg
}
