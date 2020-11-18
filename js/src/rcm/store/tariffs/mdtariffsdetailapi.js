import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/pricemanage/sale/'

function inithead () {
  return axios.post(url + 'template/initHeaderInfo', {})
}
// warehouse 调用接口
function getChargingItems (itemServiceId) {
  return axios.post(url + 'priceAdjustTable/getChargingItemsFromAllPriceTable', {itemServiceId})
}
// warehouse 调用接口 ---- 启动同步基础价目表线程
function doSynchronizeFromSob () {
  return axios.post(url + 'basePriceTable/doSynchronizeFromSob')
}

export default {
  inithead,
  getChargingItems,
  doSynchronizeFromSob,
}
