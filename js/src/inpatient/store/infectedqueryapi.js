import {inpatient as axios} from './sobapi'
// import {warehouse as axios2} from '@/warehouse/store/api'
const url = '/medical-record/doctor/'

// 获取科室列表
// function dptList () {
//   var url = `/localSectionRecord/getLocalSectionVoListForService/`
//   return axios2.post(url)
// }

// 搜索
function list (params) {
  return axios.post(url + 'infectiousDiseaseRecord/search', params)
}

var tableData = [
  {
    medicalSn: '病案号',
    morbidityTime: '发病日期',
    diseaseName: '诊断名称',
    diseaseTime: '诊断日期',
    dptName: '科室',
    reporter: '报告人',
    reportTime: '报告日期',
    reportType: '报告卡分类',
    visitType: '就诊类型',
    // medicalSn: '住院号',
    name: '患者姓名',
    sex: '性别',
    age: '年龄'

  }

]
export default {
  list,
  tableData,
  // dptList
}
