import { inpatient as axios } from './sobapi'
const url = '/sob/'

// 获取病区信息
function inpatientarea (params) {
  return axios.post(url + 'areaproviderr/getAreaList', params)
}

// 获取病房信息
function getWards (params) {
  return axios.post(url + 'hospitalizedWard/getHospitalizedWards', params)
}

// 获取病床信息
function hospitalizedBed (params) {
  return axios.post(url + 'hospitalizedBed/getBedListByWardId', params)
}

// 获取医生/医助接口
function providerdoctor (params) {
  return axios.post(url + 'providerdoctor/getDoctorByProviderId', params)
}

// 获取护士
function hospitalizedAreaNurseR (params) {
  return axios.post(url + 'hospitalizedAreaNurseR/getByAreaId', params)
}

export default {
  inpatientarea,
  hospitalizedBed,
  providerdoctor,
  hospitalizedAreaNurseR,
  getWards
}
