import {sob} from './sobapi'
// 获取部门
function getDeptList (params) {
  return sob.post('dept/getDeptList', params).then((response) => {
    return response
  })
}
// 获取科室管理的科室
function getDeptData (params) {
  return sob.post('dept/getDeptList', params).then((response) => {
    return response
  })
}

export default{
  getDeptList,
  getDeptData
}
