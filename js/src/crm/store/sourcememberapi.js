import { crm as axios } from './api'
const url = 'member/'
// function list (params) {
//   if (params.type && !params.idNo) {
//     delete params.type
//     return axios.get(url + 'search', { params: params })
//     .then((response) => {
//       response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
//       return response
//     })
//   } else if (!params.type && params.idNo) {
//     delete params.idNo
//     return axios.get(url + 'search', { params: params })
//     .then((response) => {
//       response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
//       return response
//     })
//   } else {
//     return axios.get(url + 'search', { params: params })
//       .then((response) => {
//         response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
//         return response
//       })
//   }
// }
function list (params) {
  params.labelIdName && delete params.labelIdName
  if (params.labelIds && params.labelIds.length > 0) {
    params.labelIds = params.labelIds.join(',')
  } else {
    delete params.labelIds
  }
  if (!params.type && !params.idNo) {
    return axios.get(url + 'search', { params: params })
    .then((response) => {
      response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
      return response
    })
  } else if (params.type && params.idNo) {
    return axios.get(url + 'search', { params: params })
    .then((response) => {
      response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
      return response
    })
  } else {
    return axios.get(url + 'search', { params: params })
    .then((response) => {
      response.totalCount = response.data && response.data.totalCount ? response.data.totalCount : 0
      return response
    })
  }
}

export default {
  list
}
