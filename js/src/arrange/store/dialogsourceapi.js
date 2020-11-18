import {arrange} from './api'
const url = 'arrange/'

// 查询需要导入的资源
function list (params) {
  if (!params || !params.resourceType) {
    return
  }
  return arrange.post(url + 'resource/searchImportResources', params).then((response) => {
    console.log(response)
    return response
  })
}

// 导入资源
function getAvailableTimeTrunk (params) {
  return arrange.post(url + 'resource/import', params).then((response) => {
    return response
  })
}
export default{
  list,
  getAvailableTimeTrunk
}
