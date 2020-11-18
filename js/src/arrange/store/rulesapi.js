import { arrange as axios } from './api'
const url = '/arrange/'

function list (params) {
  return axios.post(url + 'appt/ruleConfig/queryList/', params)
    .then(result => {
      return result
    })
}
function saveRules (params) {
  return axios.post(url + 'appt/ruleConfig/save/', params)
  .then(result => {
    return result
  })
}
function updateRulesName (params) {
  return axios.post(url + 'appt/ruleConfig/updateRuleName/', params)
  .then(result => {
    return result
  })
}
function updateRuleDetail (params) {
  return axios.post(url + 'appt/ruleConfig/updateRuleDetail/', params)
  .then(result => {
    return result
  })
}
function enableRules (params) {
  return axios.post(url + 'appt/ruleConfig/enable', params)
  .then(result => {
    return result
  })
}
function disableRules (params) {
  return axios.post(url + 'appt/ruleConfig/disable', params)
  .then(result => {
    return result
  })
}
function updateIsExistCharge (params) {
  return axios.post(url + 'appt/ruleConfig/updateIsExistCharge', params)
  .then(result => {
    return result
  })
}
export default {
  list,
  saveRules,
  updateRulesName,
  updateRuleDetail,
  enableRules,
  disableRules,
  updateIsExistCharge
}
