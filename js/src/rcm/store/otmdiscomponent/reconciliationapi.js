import fetch from '../api'
import {diction} from '@/store/common'
const baseUrl = diction.api
const timerUrl = `${baseUrl}/rcm/med/medMonthSettle`
// 查询对账记录
export function searchMedCheckAccount (data) {
  return fetch({
    url: `${timerUrl}/searchMedCheckAccount`,
    method: 'post',
    data: data
  })
}
// 费用上报
export function uploadMedCheckAccount (data) {
  return fetch({
    url: `${timerUrl}/uploadMedCheckAccount`,
    method: 'post',
    data: data
  })
}
// 省保月结记录查询
export function searchMedMonthSettle (data) {
  return fetch({
    url: `${timerUrl}/searchMedMonthSettle`,
    method: 'post',
    data: data
  })
}
// 省保月结
export function monthSettle (data) {
  return fetch({
    url: `${timerUrl}/monthSettle`,
    method: 'post',
    data: data
  })
}
// 省保取消月结
export function cancelSettle (data) {
  return fetch({
    url: `${timerUrl}/cancelSettle`,
    method: 'post',
    data: data
  })
}
