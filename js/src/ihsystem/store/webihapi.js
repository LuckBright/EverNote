import { web as axios } from './ihapi'
const urlCounsel = '/titan-doctor/counsel'
const urlDoctor = '/titan-doctor/doctor'
const urlSurvey = '/titan-doctor/survey/v1.0/'
function doctorAccept (params) {
  return axios.post(`${urlCounsel}/v1.1/accept/`, params)
}

function doctorFinish (params) {
  return axios.post(`${urlCounsel}/v1.1/finish/`, params)
}

function doctorReject (params) {
  return axios.post(`${urlCounsel}/v1.1/reject/`, params)
}
function getAnswerId (params) {
  return axios.post(`${urlSurvey}/getAnswerNumBySurveyId/`, params)
}
function getRejectState (params) {
  return axios.get(`${urlCounsel}/v1.1/counselDetail/${params}`).then(rs => {
    return rs.data ? rs.data.status : -1
  })
}
function createLiveSession (params) {
  return axios.post(`${urlDoctor}/createLiveSession`, params)
}

function changeLiveState (params) {
  return axios.post(`${urlDoctor}/changeLiveState`, params)
}
export default {
  doctorAccept,
  doctorFinish,
  doctorReject,
  getAnswerId,
  getRejectState,
  createLiveSession,
  changeLiveState
}
