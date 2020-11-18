import { card as axios } from './api'
const url = '/benefitPoint/'
const url1 = '/pointsFlow/'

function list (params) {
  return axios.post(url + 'search', params)
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function addPoint (obj) {
  return axios.post(url1 + 'addPoints/', obj)
}
function exchangePoint (obj) {
  return axios.post(url1 + 'exchangePoints/', obj)
}
function changeList (id) {
  return axios.post(url1 + 'search/', { patientId: id })
}
function setAllHalve (id) {
  return axios.get('/pointsFlow/setAllHalve', { patientId: id })
}
function setAllZero (id) {
  return axios.get('/pointsFlow/setAllZero', { patientId: id })
}
function createOrUpdate (params) {
  return axios.post('/benefitPointsExchange/createOrUpdate', params)
}
function getTypeList (params) {
  return axios.get('/benefitPointsExchange/searchByPage?offset=' + params.offset + '&pagesize=' + params.pagesize + '&status=' + params.status)
}
function idcardsSearch () {
  return axios.get('/benefit/search?isGroup=0')
}
function del (params) {
  return axios.get('/benefitPointsExchange/delete?id=' + params.id)
}
function getTypeListAll (params) {
  return axios.get('/benefitPointsExchange/search?typeCode=' + params.typeCode)
}
export default {
  addPoint,
  exchangePoint,
  list,
  changeList,
  setAllHalve,
  setAllZero,
  createOrUpdate,
  getTypeList,
  idcardsSearch,
  del,
  getTypeListAll
}
