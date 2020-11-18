import { patientBase as patient } from 'utils/baseapi'
import { prefix } from 'utils/urls.js'
let urlIM = prefix.member + 'counsel/v1.1/'

// 获取问诊详情
const IM_COUNSELDETAIL = ({ commit, state }, options) => {
  return patient.get(urlIM + `counselDetail/${options.groupId}`)
}

export default {
  IM_COUNSELDETAIL
}
