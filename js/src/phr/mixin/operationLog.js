import { request } from '@/util/req'
import store from '@/store/index'

import urlMap from '@/inpatient/urls'
function operationLog (params, more) {
  let url = more ? '/medical-record/doctor/oplog/batch/add' : '/medical-record/doctor/oplog/add'
  request(url, params)
}

const commandCodes = {
  UPDATE: 100, // 修改 前端没用
  LOGIN: 200, // 登录
  CREATE: 300, // 创建，新增记录
  DELETE: 400, // 删除
  QUERY: 500, // 查询
  LOGOUT: 600, // 登出
  SAVE: 1000, // 保存，新增或修改记录
  SUBMIT: 1100, // 提交
  PRINT: 1200, // 打印
  REF_INFO: 1300, //  引用信息
  MANUAL_ARCHIVE: 1400, // 手动归档 *
  AUTO_ARCHIVE: 1500, // 自动归档 *
  REF_TEMPLATE: 1600, // 引用模板
  SAVE_AS_TEMPLATE: 1700, // 另存为模板
  CLICK_CREATE: 5001, // 点击新建
  CLICK_EDIT: 5002// 点击编辑
}
// 传进来的openType为commandCodes的key
export let commandLog = function ({ content, opModuleOne, opType, patientId, visitNumber, patientName }, more) {
  // console.log(content, opModuleOne, opType, commandCodes[opType])
  operationLog({
    content,
    opModuleOne,
    patientId,
    visitNumber,
    patientName,
    orgId: store.state.currentUser.organizationId,
    orgName: store.state.currentUser.organizationName,
    opType: commandCodes[opType]
  })
}

export let getCategoryNameByCode = async function (code, callback) {
  await request(urlMap.medicalRecord.getCategoryByCode, {
    code: code
  }).then(res => {
    if (res.head.errCode === 0) {
      callback && callback(res.data.name)
    }
  })
}

export const clinicCodes = ['yi_liao_bei_jing', 'CHUAN_RAN_BING_BAO_GAO_KA_MEN', 'SHOU_NUE_DAI_SHOU_QI_SHI_REN_QUN', 'XI_DU_PING_GU_DAN', 'XU_JIU_PING_GU_DAN', 'ER_TONG_HUAN_ZHE_PING_GU_DAN', 'CHENG_REN_HUAN_ZHE_PING_GU_DAN', 'yu_jian_bing_li']
export const clinicCodeText = {
  'yi_liao_bei_jing': '医疗背景',
  'CHUAN_RAN_BING_BAO_GAO_KA_MEN': '传染病上报卡',
  'SHOU_NUE_DAI_SHOU_QI_SHI_REN_QUN': '受虐待受歧视评估单',
  'XI_DU_PING_GU_DAN': '吸毒评估单',
  'XU_JIU_PING_GU_DAN': '酗酒评估单',
  'ER_TONG_HUAN_ZHE_PING_GU_DAN': '儿童评估单',
  'CHENG_REN_HUAN_ZHE_PING_GU_DAN': '成人评估单',
  'yu_jian_bing_li': '预检病历'
}
export default operationLog
