import {warehouse} from '@/warehouse/store/api'
import { auth } from '@/auth/store/api.js'

const newUrl = '/thc-platform-core/out/'

export function getStaffSettingInfoByStaffId (params) {
  // return warehouse.post('staffSetting/getStaffSettingInfoByStaffId/', params).then(res => {
  //   return res
  // }).catch(err => {
  //   console.error(err)
  // })
  return auth.post(newUrl + 'staff/getStaffListByIdList', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return res
  }).catch(() => {
    return false
  })
}

export function getSourceByLocalSettingListByIdsForService (params) {
  return warehouse.post('localSetting/getSourceByLocalSettingListByIdsForService/', params).then(res => {
    return res
  }).catch(() => {
    return false
  })
}

export function getStaffListDoctor (params) {
  return auth.post(newUrl + 'staff/getStaffListByCondition/', params).then(res => {
    if (res && res.data) {
      return res.data.resultList || []
    }
    return []
  }).catch(() => {
    return []
  })
}
