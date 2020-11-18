import moment from 'moment'
import axios from '@/rcm/store/api'
import sobapi from '@/card/store/selftariffsdetailapi'
import {passport} from '@/card/store/passportapi'
const bigCustomer = 'er/bigCustomer/'
const reimburseProgramme = 'er/reimburseProgramme/'

function getCostomNo (params) {
  return axios.get('getDocNo', {params: params})
}
async function getCostom () {
  return await axios.get(bigCustomer + 'getAll')
}
function createOrUpdate (obj) {
  var path = bigCustomer + (obj.id ? 'update' : 'create')
  return axios.post(path, obj)
}
function createOrUpdateBx (obj) {
  var path = reimburseProgramme + (obj.id ? 'update' : 'create')
  let itemIds = []
  obj.serviceIds.itemIds.map(v => {
    itemIds.push(v.id)
  })
  if (obj.serviceIds && obj.serviceIds.status) {
    delete obj.serviceIds.status
  }
  if (obj.serviceIdsObj && obj.serviceIdsObj.status) {
    delete obj.serviceIdsObj.status
  }
  obj.serviceIds.itemIds = itemIds
  return axios.post(path, obj)
}

async function list (params) {
  return await axios.post(bigCustomer + 'getList', params)
}
async function listBx (params) {
  return await axios.post(reimburseProgramme + 'getList', params)
}

function getById (id) {
  return axios.post(bigCustomer + 'get', { id }).then(result => {
    result.data.expirationDate = moment(result.data.expirationDate).format('YYYY-MM-DD')
    return result.data
  })
}
async function getByIdBx (id) {
  let data = await axios.post(reimburseProgramme + 'get', { id })
  data.data.serviceIds = JSON.parse(data.data.serviceIds)
  data.data.serviceIds.status = data.data.serviceIds.itemIds.length > 0 ? 'second' : 'first'
  data.data.reimburseRate = String(data.data.reimburseRate)
  data.data.benefitRate = String(data.data.benefitRate)
  if (data.data.serviceIdsObj.itemIds.length > 0) {
    let itemData = await sobapi.queryServiceVariable({serviceIds: data.data.serviceIds.itemIds})
    data.data.serviceIds.itemIds = itemData.data
  }

  data.data.serviceIds.categoryIds = data.data.serviceIdsObj.categoryIds
  return data.data
}

// 删除大客户信息
function del (id) {
  return axios.post(bigCustomer + 'delete', {id: id}).then(result => {
    return result
  })
}
// 删除福利方案
function delBx (id) {
  return axios.post(reimburseProgramme + 'delete', {id: id}).then(result => {
    return result
  })
}

// 根据福利方案查询已绑定的会员，有分页
function getPatientsByWelfare (params) {
  return axios.post(reimburseProgramme + 'getPatinets', params).then(res => {
    return res
  })
}
// 根据福利方案查询所有绑定会员，没有分页
function getAllPatientsByWelfare (params) {
  return axios.get(reimburseProgramme + 'getPatientsByProgramme', {params: params}).then(result => {
    return result
  })
}
// 解绑
function unBind (params) {
  return axios.post(reimburseProgramme + 'delPatinet', params).then(res => {
    return res
  })
}
// passport接口所有用户
function getPatientList (params) {
  return passport.get('patient/search', {params: params})
    .then((response) => {
      return response
    })
}
// 福利方案中添加用户接口
function addPatients (params) {
  return axios.post(reimburseProgramme + 'addPatinets', params).then(res => {
    return res
  })
}

export const profileApi = {
  getCostomNo,
  list: list,
  getById: getById,
  createOrUpdate: createOrUpdate,
  del: del
}
export const welfareApi = {
  list: listBx,
  getById: getByIdBx,
  createOrUpdate: createOrUpdateBx,
  del: delBx,
  getCostom
}
export default {
  getPatientList,
  getPatientsByWelfare,
  getAllPatientsByWelfare,
  unBind,
  addPatients
}
