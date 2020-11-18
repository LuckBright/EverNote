import {workspace as axios} from './api'

const url = '/phr/'
const url1 = '/sob/'
const url2 = '/arrange/'

// doctor/doctorAdvice/getByPatientIdAndType
function getRecord (type, id, offset, pagesize) {
  return axios.post(url + 'doctor/doctorAdvice/getByPatientIdAndType', {
    adviceType: type,
    patientId: id,
    offset: offset,
    pagesize: pagesize
  })
}
// 个人数据统计
function getPatientStat (params) {
  return axios.get(url + 'doctor/bodyCheck/getByPatientIdAndTime4Graph', {
    params: params
  })
}
// 数据
function getDetail (visitSn) {
  return axios.get(url + 'doctor/inspectRecord/getPageByVisitSn', {
    params: {
      visitSn: visitSn
    }
  })
}

// 用药记录(中药)
function getChiRecipeRecord (id, offset, pagesize) {
  return axios.get(url + 'doctor/chiRecipeRecord/getPageByPatientId', {
    params: {
      patientId: id,
      offset: offset,
      pagesize: pagesize
    }
  })
}

// 检验记录
function getInspectRecord (id, offset, pagesize) {
  return axios.get(url + 'doctor/inspectRecord/getPageByPatientId', {
    params: {
      patientId: id,
      offset: offset,
      pagesize: pagesize
    }
  })
}

// 获取单个检验记录
function getInspectRecordDetail (id) {
  return axios.get(url + 'doctor/inspectResultItem/getByInspectRecordId', {
    params: {
      recordId: id
    }
  })
}

// 用药记录(西药)
function getRecipeRecord (id, offset, pagesize) {
  return axios.get(url + 'doctor/recipeRecord/getPageByPatientId', {
    params: {
      patientId: id,
      offset: offset,
      pagesize: pagesize
    }
  })
}

// 诊断
function getMedicalRecord (id, offset, pagesize) {
  return axios.get(url + 'doctor/medicalRecordResult/getPageByPatientId', {
    params: {
      patientId: id,
      offset: offset,
      pagesize: pagesize
    }
  })
}

// 预约
function getAppoint (id, offset, pagesize) {
  return axios.post(url2 + 'appoint/listByPatientId', {
    patientId: id,
    offset: offset,
    pagesize: pagesize
  })
}

// 治疗记录
function getDealRecord (id, offset, pagesize) {
  return axios.get(url + 'doctor/dealRecord/getPageByPatientId', {
    params: {
      patientId: id,
      offset: offset,
      pagesize: pagesize
    }
  })
}

// 疗程记录
function getWithItem (id, offset, pagesize) {
  return axios.post(url1 + 'order/queryWithItem', {
    patientId: id,
    offset: offset,
    pagesize: pagesize
  })
}

// 获取个人当天的全部报告
function getInspectionReport (vist, type) {
  return axios.post(url + 'doctor/executeResult/getByVisitSnAndAdviceType', {
    visitSn: vist,
    adviceType: type
  })
}

const baseDate = {
  useMethod: {
    1: '口服',
    2: '外服'
  },
  source: {
    1: '本院',
    2: '外购',
    3: '代购'
  },
  decoct: {
    0: '不代煎',
    1: '代煎'
  },
  status: {
    0: '草稿',
    1: '提交'
  },
  diseaseType: {
    1: '中医诊断',
    2: '西医诊断'
  },
  diagnoseSort: {
    1: '',
    2: '次要诊断'
  },
  diagnoseType: {
    1: '',
    2: '待查'
  },
  appointmentState: {
    '0': '已预约',
    '1': '已确认',
    '2': '已就诊',
    '-1': '已取消',
    '-2': '已超时',
    '-3': '爽约'
  }
}

export default {
  getPatientStat,
  getRecipeRecord,
  getChiRecipeRecord,
  baseDate,
  getAppoint,
  getMedicalRecord,
  getDealRecord,
  getWithItem,
  getInspectRecord,
  getInspectRecordDetail,
  getDetail,
  getRecord,
  getInspectionReport
}
