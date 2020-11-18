import {warehouse as axios} from '@/warehouse/store/api'
let url = 'uniqueCode/'
let url1 = 'uniqueCodeRelation/'
function create (params) {
  return axios.post(url + 'createUniqueCodeList/', params).then(result => {
    return result
  })
}
function getEntry (params) {
  return axios.post(url1 + 'getUniqueCodeRelation/', params).then(result => {
    return result
  })
}
function getOutput (params) {
  return axios.post(url1 + 'getUniqueCodeRelationObject/', params).then(result => {
    return result
  })
}
export default {
  create,
  getEntry,
  getOutput
}
