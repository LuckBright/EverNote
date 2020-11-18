import { patientBase as patient } from 'utils/baseapi'
import { prefix } from 'utils/urls.js'
let urlIM = prefix.member + 'im/'

// IM历史记录
const IM_GETIMRECORDLIST = ({ commit, state }, options) => {
  return patient.post(urlIM + 'getImRecordList', options)
}

// 获取聊天对方数据
const IM_GETGROUPMEMBER2 = ({ commit, state }, options) => {
  return patient.get(urlIM + `getGroupMember2/${options.groupId}`)
}

export default {
  IM_GETIMRECORDLIST,
  IM_GETGROUPMEMBER2
}
