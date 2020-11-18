import axios from '../api'
import {warehouse as warehouseApi} from '@/warehouse/store/api'

function getById (params) {
  return axios.post('ic/costCaculate/getCostDetail', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function list (params) {
  return axios.post('ic/costCaculate/getCostDetail', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function update (params) {
  return axios.post('ic/costCaculate/createCostCaculate', params).then((response) => {
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
  return warehouseApi.post('localSetting/getLocalSettingList/', params).then((response) => {
    return response
  })
}

export default {
  list,
  getById,
  update,
  getStorageRoomList,
  getLocalSettingList,
  getPeriod
}
