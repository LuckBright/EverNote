import { card as axios } from './api'
import moment from 'moment'
const url = '/memberCard/'

function getById (id) {
  return axios.get(url + 'getById', {params: {
    id: id
  }}).then(result => {
    return result
  })
}
function formatCardCreateData (obj) {
  return {
    memberCard: {
      batchId: obj.batchId,
      userId: obj.userInfo.length > 0 ? obj.userInfo[0].id : '',
      patientId: obj.userInfo.length > 0 ? obj.userInfo[0].id : '',
      storedMoney: obj.storedMoney,
      givedMoney: obj.givedMoney ? obj.givedMoney : null,
      startDate: obj.datetimes ? moment(obj.datetimes[0]).format('YYYY-MM-DD HH:MM:SS') : null,
      endDate: obj.datetimes ? moment(obj.datetimes[1]).format('YYYY-MM-DD HH:MM:SS') : null,
      cardBuyer: obj.userInfo && obj.userInfo.length > 0 ? obj.userInfo[0].id : null
    },
    statement: {
      chargeMethod: obj.chargeMethod,
      chargeStatement: obj.chargeStatement
    },
    cardNum: obj.cardNum,
    cardNos: obj.cardNos
  }
}
function createOrUpdate (obj) {
  let path = obj.id ? 'modify' : 'sellCard'
  return axios.post(url + path + '/', this.formatCardCreateData(obj))
}
function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}
export default {
  getById,
  createOrUpdate,
  del,
  formatCardCreateData
}
