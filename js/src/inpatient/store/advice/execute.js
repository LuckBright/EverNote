import {inpatient as axios} from '../sobapi'
const url = '/sob/inpatientController/'

function list (params) {
  return axios.post(url + 'queryExecuteAdviceList', params)
}

function executeAdvice (params) {
  return axios.post(url + 'executeAdvice', params)
}

function executeResultBatch (params) {
  return axios.post(url + 'executeResultBatch', params)
}

function updateOutpatientExecuteBatch (params) {
  return axios.post(url + 'updateOutpatientExecuteBatch', params)
}

export default {
  list,
  executeAdvice,
  executeResultBatch,
  updateOutpatientExecuteBatch
}
