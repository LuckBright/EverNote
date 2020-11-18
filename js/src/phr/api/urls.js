// import {prefix} from '@/util/urls'

let prefix = '' // 'thc-platform-core/' http://yapi.everjiankang.com/mock/193
let prefix1 = ''
export default {
  bingliList: {url: '/thc-phr/cpoe/phrMedicalRecord/getMedicalRecordBySerialNumber', prefix},
  shoushuList: {url: '/thc-phr/cpoe/phrOperationInfo/getPageOperationInfo', prefix},
  jiuzhenList: {url: '/thc-phr/arrange/phrVisitOutpatient/pageList', prefix},
  dateList: { url: '/thc-phr/arrange/phrVisitOutpatient/pageList', isStatic: false, prefix: prefix }, // 时间轴
  patientList: { url: '/thc-phr/member/phrPatientInfo/pageList', isStatic: false, prefix: prefix }, // 查询患者列表
  consultationsList: { url: '/thc-phr/cpoe/phrDiagnose/getDiagnoseInfoBySerialNumber', isStatic: false, prefix: prefix }, // 患者本次就诊诊断数据列表
  diagnosisList: { url: '/thc-phr/cpoe/phrDiagnose/getDiagnoseInfoBySerialNumber', isStatic: false, prefix: prefix }, // 诊断信息列表
  archives: { url: '/thc-phr/member/phrPatientInfo/getHealthRecordsByPatientId', isStatic: false, prefix: prefix }, // 健康档案
  allergyList: { url: '/thc-phr/cpoe/phrAllergen/pageList', isStatic: false, prefix: prefix }, // 过敏信息列表
  yujianList: {url: '/thc-phr/cpoe/preview-info/list', prefix, noSlash: true},
  zhuankeList: {url: '/thc-phr/cpoe/transfer-dept-info/list', prefix, noSlash: true},
  guahaoList: {url: '/thc-phr/cpoe/registration/list', prefix, noSlash: true},
  yuyueList: {url: '/thc-phr/cpoe/appointment/list', prefix, noSlash: true},
  tizhengList: { url: '/thc-phr/cpoe/phrSign/getSignInfoBySerialNumber', isStatic: false, prefix: prefix }, // 查询体征列表
  treatmentList: { url: '/thc-phr/cpoe/treatment/patient-list', isStatic: false, prefix: prefix1 }, // 治疗列表
  inspectList: { url: '/thc-phr/cpoe/examine/groupByExecuteDate', isStatic: false, prefix: prefix }, // 检查
  testList: { url: '/thc-phr/cpoe/inspection/patient-list', isStatic: false, prefix: prefix }, // 检验
  lineList: { url: '/thc-phr/cpoe/inspection/trace/', isStatic: false, prefix: prefix }, // 检验示踪
  hisList: { url: '/thc-phr/cpoe/inspection/result-detail-list', isStatic: false, prefix: prefix }, // 检验历史对比
  doctoradviceList: { url: '/thc-phr/cpoe/medical-advice/list', isStatic: false, prefix: prefix }, // 治疗列表
  getGroupMember: { url: 'getGroupMember', isStatic: true }, // 查询问诊人员
  getImRecordList: { url: 'getImRecordList', isStatic: true }, // 查询问诊记录
  // followUp: { url: '/thc-phr/cpoe/followup/patient-list', isStatic: false }, // 查询问诊记录
  followUp: { url: '/thc-phr/cpoe/sk/patient-list', isStatic: false }, // 查询随访记录
  followUpSummary: { url: '/thc-phr/cpoe/sk/patient-summary-list', isStatic: false }, // 查询问诊记录
  getPhrInquiringInfoBySerialNumber: { url: '/thc-phr/ih/phrInquiring/getPhrInquiringInfoBySerialNumber', isStatic: false }, // 查询问诊记录
  getImInfoByOrderNo: { url: '/thc-phr/ih/phrInquiring/getImInfoByOrderNo', isStatic: false }, // 查询问诊记录
  getGroupMemberByOrderNo: { url: '/thc-phr/ih/phrInquiring/getGroupMemberByOrderNo', isStatic: false }, // 查询问诊记录
  dataInterface: {
    list: '/thc-phr/bizCustom/page/',
    del: '/thc-phr/bizCustom/delete/',
    update: '/thc-phr/bizCustom/update/',
    insert: '/thc-phr/bizCustom/insert/',
  },
  pre: { // 预问诊
    list: '/thc-phr/cpoe/preInquiry/list',
    detail: '/thc-phr/cpoe/preInquiry/detail',
    history: '/thc-phr/cpoe/preInquiry/history'
  },
  search: {
    list: '/thc-phr/member/phrPatientInfo/search',
    follow: '/thc-phr/member/phrPatientInfo/listFollowPatientInfo',
    status: '/thc-phr/doctorFollow/getFollowStatus',
    scope: '/thc-phr/member/phrPatientInfo/getAuthOfPatientScope',
    switch: '/thc-phr/doctorFollow/switchFollow'
  },
  chart: '/thc-phr/stat/index',
  preTable: '/thc-phr/cpoe/preInquiry/summaryList',
  getVideoUrl: '/titan-im/getVideoUrl/'
}
