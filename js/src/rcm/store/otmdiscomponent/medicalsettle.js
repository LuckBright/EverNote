import fetch from '../api'
import {diction} from '@/store/common'
const baseUrl = diction.api
const timerUrl = `${baseUrl}/rcm/ip/timer`
// 门诊部分
// 住院部分
// ---------------------------------
// 预结算设置
export function timerSearch (data) {
  return fetch({
    url: `${timerUrl}/search`,
    method: 'post',
    data: data
  })
}
export function timerSave (data) {
  return fetch({
    url: `${timerUrl}/save`,
    method: 'post',
    data: data
  })
}
export function timerUpdate (data) {
  return fetch({
    url: `${timerUrl}/update`,
    method: 'post',
    data: data
  })
}
// ---------------------------------
// 住院结算诊断对照
export function medicalDiagnoseList (data) {
  return fetch({
    url: `${baseUrl}/insurance/medicareDiseaseDir/page`,
    method: 'post',
    data: data
  })
}

