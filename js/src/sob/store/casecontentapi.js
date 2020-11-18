import { workspace as axios } from '@/workspace/store/api'
let url = 'sob/recipeTemplate/'

function list (params) {
  params.name = params.name || ''
  params.dptId = params.dptId || ''
  if (params.tplType) params.type = params.tplType
  if (params.type) {
    params.type = Array.isArray(params.type) ? params.type : [params.type]
  }
  return axios.post(url + 'queryList', params).then(result => {
    return result.data
  })
}

function del (id) {
  return axios.post(url + 'delete', axios.jsonToFormEncoded({ id }))
}

function createOrUpdate (obj) {
  let action = obj.id ? 'modify' : 'create'
  return axios.post(url + action, obj)
}

function getById (id) {
  return axios.get(url + 'getById', {
    params: {
      id
    }
  })
}

// 获取所有处方模版list(包括个人模版，机构模版)
function getAllTplList (params) {
  params.name = params.name || ''
  params.dptId = params.dptId || ''
  if (params.tplType) params.type = params.tplType
  if (params.type) {
    params.type = Array.isArray(params.type) ? params.type : [params.type]
  }
  return axios.post(url + 'searchForDoctorAdvice', params).then(result => {
    return result.data
  })
}

export default {
  list,
  del,
  getById,
  createOrUpdate,
  getAllTplList
}
