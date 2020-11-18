import { warehouse as axios } from './api'
const url = 'supplier/'
const clinicUrl = 'supplierLocal/'
const contUrl = 'ContractMaterialsItem/'

// 集团查看供应商详情
function getById (id) {
  return axios.post(url + 'getSupplierInfo/', {
    id
  }).then(result => {
    return result
  })
}

// 机构查看供应商详情
function getClinicById (id) {
  return axios.post(clinicUrl + 'getSupplierLocalById/', {
    id
  }).then(result => {
    return result
  })
}

function update (params) { // 保存调价记录
  return axios.post(contUrl + 'update/', params)
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateSupplier' : 'createSupplier'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateSupplier/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getSupplierList/', params)
}

function validation (params) {
  return axios.post(url + 'getNumBySupplierOnly/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 集团供应商列表
function getSupplierSimpleList (params) {
  return axios.post(url + 'getSupplierSimpleList/', params)
}

// 供应商姓名、社会统一信用代码校验
function queryContainNameCode (params) {
  return axios.post(url + 'queryContainNameCode/', params)
}

// 机构供应商修改
function updateClinicSupplier (params) {
  return axios.post(clinicUrl + 'updateSupplierLocal/', params)
}

// 供应商机构开启列表
function getRelations (params) {
  return axios.post(url + 'getRelations/', params)
}

// 集团供应商机构批量启用
function awardSupplierLocal (params) {
  return axios.post(url + 'awardSupplierLocal/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  validation,
  update,
  getSupplierSimpleList,
  queryContainNameCode,
  getClinicById,
  updateClinicSupplier,
  getRelations,
  awardSupplierLocal
}
