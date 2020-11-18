import api from '@/titanmall/utils/api.js'

let url = api.url
let axios = api.base

// 获取服务商列表
function getServiceProviderList (params) {
  return axios.post(url + 'manage/spu/manage/getServiceProviderList', params)
}

// 保存服务商
function createServiceProvider (params) {
  return axios.post(url + 'manage/spu/manage/createServiceProvider', params)
}

// 查询默认服务商
function getDefaultServiceProvider () {
  return axios.post(url + 'manage/spu/manage/getDefaultServiceProvider')
}

// 删除服务商
function deleteServiceProvider (id) {
  return axios.get(url + 'manage/spu/manage/deleteServiceProvider/' + id)
}

// 修改服务商
function updateFacilitator (params) {
  return axios.post(url + 'manage/spu/manage/updateFacilitator', params)
}

// 获取商品管理列表
function spuList (params) {
  return axios.post(url + 'manage/spu/list', params)
}

// 获取商品链接
function spuLink (params) {
  return axios.get(url + 'manage/spu/link?id=' + params)
}

// 下架商品
function spuLowerShelf (params) {
  return axios.get(url + 'manage/spu/lowerShelf?id=' + params)
}

// 上架商品
function spuUpperShelf (params) {
  return axios.get(url + 'manage/spu/upperShelf?id=' + params)
}

// 删除商品
function spuDelete (params) {
  return axios.get(url + 'manage/spu/delete?id=' + params)
}

// 修改序号
function spuUpdateSidBySpuId (params) {
  return axios.post(url + 'manage/spu/updateSidBySpuId', params)
}

// 商品列表页获取分组下拉列表
function groupListBySpuGroupBox () {
  return axios.get(url + 'manage/group/listBySpuGroupBox')
}

// 保存商品信息
function spuCreate (params) {
  return axios.post(url + 'manage/spu/create', params)
}

// 保存编辑信息
function spuSave (params) {
  return axios.post(url + 'manage/spu/save', params)
}

// 获取商品信息回显
function spuGetById (params) {
  return axios.get(url + 'manage/spu/getById?id=' + params.id)
}

// 获取规格项目
function findKeyByShop (params) {
  return axios.post(url + 'manage/attributeKey/findKeyByShop', params)
}

// 创建规格项目
function attributeKeyCreate (params) {
  return axios.post(url + 'manage/attributeKey/create', params)
}

// 获取规格值
function findValueByKeyId (params) {
  return axios.post(url + 'manage/attributeValue/findValueByKeyId', params)
}

// 创建规格值

function attributeValueCreate (params) {
  return axios.post(url + 'manage/attributeValue/create', params)
}

// 获取库房列表
function spuStorageRoomList (params) {
  return axios.post(url + 'manage/spu/storageRoomList', params)
}

// 获取物资列表
function spuMaterialList (params) {
  return axios.post(url + 'manage/spu/materialList', params)
}

// 获取库存
function spuStockList (params) {
  return axios.post(url + 'manage/spu/stockList', params)
}

// 获取商品分组列表
function groupListBySpuGroup (params) {
  return axios.post(url + 'manage/group/listBySpuGroup', params)
}

// 创建分组名称
function groupCreateSpu (params) {
  return axios.post(url + 'manage/group/createSpu', params)
}

// 删除分组
function spuGroupDeleteGroupById (params) {
  return axios.get(url + 'manage/spuGroup/deleteGroupById?id=' + params)
}

// 查看已添加商品分组
function spuGroupAddedSpuList (params) {
  return axios.post(url + 'manage/spuGroup/addedSpuList', params)
}

// 删除已添加分组
function spuGroupDeleteSpuById (params) {
  return axios.get(url + 'manage/spuGroup/deleteSpuById?id=' + params)
}

// 获取未添加数据列表
function spuGroupNotAddSpuList (params) {
  return axios.post(url + 'manage/spuGroup/notAddSpuList', params)
}

// 添加商品到分组
function spuGroupAddSpu (params) {
  return axios.post(url + 'manage/spuGroup/addSpu', params)
}

// ----素材管理----

// 获取素材分组列表
function groupListByMaterialGroup () {
  return axios.post(url + 'manage/group/listByMaterialGroup')
}

// 获取素材分组中的图片数据
function materialConfigList (params) {
  return axios.post(url + 'manage/materialConfig/list', params)
}

// 创建素材名称
function groupCreateMaterial (params) {
  return axios.post(url + 'manage/group/createMaterial', params)
}

// 修改图片名称
function materialConfigChangeName (params) {
  return axios.post(url + 'manage/materialConfig/changeName', params)
}

// 删除图片
function materialConfigDelete (params) {
  return axios.get(url + 'manage/materialConfig/delete?id=' + params)
}

// 获取素材分组下拉列表
function groupListByMaterialGroupBox () {
  return axios.get(url + 'manage/group/listByMaterialGroupBox')
}

// 素材图片分组
function materialConfigChangeGroup (params) {
  return axios.post(url + 'manage/materialConfig/changeGroup', params)
}

// 删除素材分组
function groupDeleteMaterialGroupById (params) {
  return axios.get(url + 'manage/group/deleteMaterialGroupById?id=' + params)
}

// 修改素材分组名称
function groupChangeGroupNameById (params) {
  return axios.post(url + 'manage/group/changeGroupNameById', params)
}

// 批量删除
function materialConfigDeleteBatch (params) {
  return axios.post(url + 'manage/materialConfig/deleteBatch', params)
}

// 批量分组
function materialConfigChangeGroupBatch (params) {
  return axios.post(url + 'manage/materialConfig/changeGroupBatch', params)
}

// 预约-保存
function appointSave (params) {
  return axios.post(url + 'manage/appoint/save', params)
}

// 预约-获取预约列表
function appointList (params) {
  return axios.post(url + 'manage/appoint/list', params)
}

// 预约-通过id获取模板
function appointGetById (params) {
  return axios.get(url + 'manage/appoint/getById?id=' + params.id)
}

// 预约-删除
function appointDelete (params) {
  return axios.get(url + 'manage/appoint/delete?id=' + params.id)
}

// 获取预约下拉框列表
function appointGetAll (params) {
  return axios.post(url + 'manage/appoint/getAll', params)
}

export default {
  getServiceProviderList,
  createServiceProvider,
  getDefaultServiceProvider,
  deleteServiceProvider,
  updateFacilitator,
  spuList,
  spuLink,
  spuLowerShelf,
  spuUpperShelf,
  spuDelete,
  spuCreate,
  spuSave,
  spuGetById,
  findKeyByShop,
  attributeKeyCreate,
  findValueByKeyId,
  attributeValueCreate,
  spuStorageRoomList,
  spuMaterialList,
  spuStockList,
  spuUpdateSidBySpuId,
  groupListBySpuGroup,
  groupCreateSpu,
  spuGroupDeleteGroupById,
  spuGroupAddedSpuList,
  groupListBySpuGroupBox,
  spuGroupDeleteSpuById,
  spuGroupNotAddSpuList,
  spuGroupAddSpu,
  groupListByMaterialGroup,
  materialConfigList,
  groupCreateMaterial,
  materialConfigChangeName,
  materialConfigDelete,
  groupListByMaterialGroupBox,
  materialConfigChangeGroup,
  groupDeleteMaterialGroupById,
  groupChangeGroupNameById,
  materialConfigDeleteBatch,
  materialConfigChangeGroupBatch,
  appointSave,
  appointList,
  appointGetById,
  appointDelete,
  appointGetAll,
}
