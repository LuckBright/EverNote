import {crm as axios} from './api'
const url = 'feedbackHandle/'
function handle (params) {
  return axios.post(url + 'handle', params)
}
function submit (id) {
  return axios.post(url + 'submit', {id: id})
}
function reply (params) {
  return axios.post('feedback/reply', params)
}
export default {
  handle,
  submit,
  reply
}
