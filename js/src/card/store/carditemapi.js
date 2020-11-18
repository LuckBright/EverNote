import { card as axios } from './api'
import { passport } from './passportapi'
import moment from 'moment'
const url = '/memberCard/'

function getById (id) {
  return axios.get(url + 'getById', {
    params: {
      id: id
    }
  }).then(result => {
    return result
  })
}
function formatCardData (obj) {
  let formdata = {
    memberCard: {
      id: obj.id,
      batchId: obj.batchId,
      userId: obj.userInfo && obj.userInfo.length > 0 ? obj.userInfo[0].id : null,
      patientId: obj.userInfo && obj.userInfo.length > 0 ? obj.userInfo[0].id : null,
      cardBuyer: obj.userInfo && obj.userInfo.length > 0 ? obj.userInfo[0].id : null,
      code: obj.code,
      storedMoney: obj.storedMoney,
      givedMoney: obj.givedMoney ? obj.givedMoney : null,
      startDate: obj.datetimes ? moment(obj.datetimes[0]).format('YYYY-MM-DD HH:mm:ss') : null,
      endDate: obj.datetimes ? moment(obj.datetimes[1]).format('YYYY-MM-DD HH:mm:ss') : null
    },
    statement: {
      chargeMethod: obj.chargeMethod,
      chargeStatement: obj.chargeStatement
    },
    shareList: obj.memberCardShares
  }
  if (Number(obj.formType) === 1) {
    formdata.shareList = obj.memberCardShares
  } else {
    formdata.memberCardShares = obj.memberCardShares
  }
  return formdata
}
function createOrUpdate (obj) {
  if (obj.uid) {
    obj.id = obj.uid
  }
  switch (Number(obj.formType)) {
    case 1:
      return axios.post(url + 'create/', this.formatCardData(obj))
    case 2:
      return axios.post(url + 'bindCard/', this.formatCardData(obj))
    case 3:
      return axios.post(url + 'charge/', this.formatCardData(obj))
    case 4:
      return axios.post(url + 'turn/', obj)
    case 5:
      obj.endDate = moment(obj.endDate).format('YYYY-MM-DD HH:MM:SS')
      return axios.post(url + 'delay/', obj)
    case 6:
      return axios.post(url + 'discard/', axios.jsonToFormEncoded(obj))
    case 7:
      return axios.post(url + 'freeze/', axios.jsonToFormEncoded(obj))
    case 8:
      return axios.post(url + 'unfreeze/', axios.jsonToFormEncoded(obj))
    case 9:
      return axios.get(url + 'getByBatchIdAndCode/', { params: obj })
  }
}
function serchNewCard (params) {
  return axios.get(url + 'getByBatchIdAndCode/', { params: params })
    .then((response) => {
      return response
    })
}
function list (params) {
  return axios.get(url + 'search/', { params: params })
    .then((response) => {
      return response
    })
}
function exportFile (params) {
  return axios.get(url + 'export/', { params: params })
    .then((response) => {
      return response
    })
}
function returnMoney (params) {
  return axios.get(url + 'getReturnMoney/', { params: params })
    .then((response) => {
      return response
    })
}
function checkCodeExist (params) {
  params = axios.jsonToFormEncoded(params)
  return axios.get(url + 'checkCodeExist/', { params: params })
    .then((response) => {
      return response
    })
}
function getUserList (params) {
  return params
}
function getPatientList (params) {
  return passport.get('patient/search', { params: params })
    .then((response) => {
      return response
    })
}

export default {
  getById,
  createOrUpdate,
  list,
  getUserList,
  formatCardData,
  getPatientList,
  checkCodeExist,
  exportFile,
  returnMoney,
  serchNewCard
}
