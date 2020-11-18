import axios from './api'
import {diction} from '@/store/common'
const url = diction.api + '/insurance/insuranceFee/'

function getInsuranceByPatient (id) {
  return axios.post(url + 'getInsuranceByPatient', {
    patientId: id
  })
}

export default {
  getInsuranceByPatient
}
