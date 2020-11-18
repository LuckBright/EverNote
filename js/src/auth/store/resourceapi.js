import { auth } from './api'
let url = '/thc-platform-core/sys/menu'

// 获取单条权限数据
function getById1 (id) {
  return auth.post(`${url}/info/${id}`)
}

// 更新一条资源
function updateItem (obj) {
  return auth.post(`${url}/update`, obj)
}

// 创建一条资源
function createItem (obj) {
  return auth.post(`${url}/save`, obj)
}

// 删除一条资源
// function del (id) {
//   return auth.post(`${url}/del`, {
//     menuId: id
//   })
// }
// 更改资源排序
function updateMenusIndexNumbers (items) {
  return auth.post(`${url}/updateMenusIndexNumbers`, {
    items
  })
}

// 获取资源树
function listTree (params) {
  // return auth.post(`http://192.168.250.38:9028/sys/menu/getResources`, params)
  return auth.post(`${url}/getResources`, params)
}

function getMaxIndexNum () {
  return auth.post(`${url}/getIndexNumber`)
}
export default {
  getById1,
  createItem,
  updateItem,
  // del,
  updateMenusIndexNumbers,
  listTree,
  getMaxIndexNum
}
