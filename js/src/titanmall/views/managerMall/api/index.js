import api from '@/titanmall/utils/api.js'

let url = api.url
let axios = api.base

// 保存首页
function createMallHomepage (params) {
  return axios.post(url + 'manage/homepage/manage/createMallHomepage', params)
}

// 获取首页数据
function getMallHomepageByShopId () {
  return axios.get(url + 'manage/homepage/manage/getMallHomepageByShopId')
}

// 获取上架商品
function findSpuByName (params) {
  return axios.post(url + 'manage/homepage/manage/findSpuByName', params)
}

// 上架首页
function updateMallHomePageOnShelf () {
  return axios.get(url + 'manage/homepage/manage/updateMallHomePageOnShelf')
}

// 获取瀑布流数据
function findInfiniteScrolling (params) {
  return axios.post(
    url + 'manage/scrolling/manage/findInfiniteScrolling',
    params,
  )
}

// 保存瀑布流数据
function saveInfiniteScrolling (params) {
  return axios.post(
    url + 'manage/scrolling/manage/saveInfiniteScrolling',
    params,
  )
}

// 创建瀑布流接口
function createInfiniteScrolling (params) {
  return axios.post(
    url + 'manage/scrolling/manage/createInfiniteScrolling',
    params,
  )
}

// 删除瀑布流数据
function deleteInfiniteScrollingBySpuId (params) {
  return axios.get(
    url + 'manage/scrolling/manage/deleteInfiniteScrollingBySpuId' + params,
  )
}

export default {
  createMallHomepage,
  getMallHomepageByShopId,
  findSpuByName,
  updateMallHomePageOnShelf,
  findInfiniteScrolling,
  saveInfiniteScrolling,
  deleteInfiniteScrollingBySpuId,
  createInfiniteScrolling,
}
