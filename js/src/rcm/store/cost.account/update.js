import axios from '../api'
import {warehouse as warehouseApi} from '@/warehouse/store/api'

function list (params) {
  return axios.post('ic/costUpdate/getCostUpdateList', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function update (params) {
  return axios.post('ic/costUpdate/updateCost', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getPeriod (params) {
  return axios.post('ic/periodManage/getPeriod', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

/**
 * 库房
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function getStorageRoomList (params) {
  return warehouseApi.post('storageRoom/getStorageRoomList/', params).then((response) => {
    return response
  })
}

/**
 * 物料
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function getLocalSettingList (params) {
  return warehouseApi.post('localSetting/getSourceByLocalSettingListBySearchForService/', params).then((response) => {
    return response
  })
}

export default {
  list,
  update,
  getStorageRoomList,
  getLocalSettingList,
  getPeriod
}
