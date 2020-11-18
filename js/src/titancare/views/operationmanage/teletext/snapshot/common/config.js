export const MSGFROM = { // 消息来源
  1: 'admin', // 系统
  2: 'me', // 自己
  3: 'you' // 对方
}

export const MSGTYPE = { // 消息类型
  TEXT: 'TIMTextElem', // 文本
  IMAGE: 'TIMImageElem', // 图片
  AUDIO: 'TIMSoundElem', // 语音
  CUSTOM: 'TIMCustomElem' // 自定义消息
}

export const SYSTEMMSGTYPE = { // 系统消息类型
  1: 'LIVE_STATUS_NOTIFY', // 视频
  2: 'TW_QUESTION', // 图文 - 提交问题
  3: 'TW_QUESTION_ACCEPT', // 图文 - 接诊
  4: 'TW_RPLIST', // 图文 - 处方
  5: 'TW_WAIT_FOR_FINISH', // 图文 - 结诊确认
  6: 'TW_STATUS_CHANGED', // 图文 - 拒绝/结束
  7: 'SYS_PLAIN', // 系统(暂未用到)
  8: 'SYS_NOTICE',
  9: 'GOODS', // 图文-接收商品推荐
  10: 'PRECONSULTATION', // 图文-接收预问诊
  11: 'OCR', // 图文-接收OCR
  12: 'ENSUREPLANTJ', // 图文-保障计划
  13: 'MEDICAL_RECORDS' // 图文-保障计划
}

export const LIVE_TYPE = { // 视频消息类型
  1: 'create_live', // 创建视频
  2: 'status_change' // 视频状态更改
}

export const IMAGE_SIZE = [0, 1, 2] // 图片大小：0:小图，1:大图，2:原图

export const ROLE_TYPE = { // 用户身份
  1: 'user', // 患者
  2: 'doctor' // 医生
}

export const ROLE_TYPE_BUTTON = { // 聊天窗底部按钮文案
  'user': '再次问诊',
  'doctor': '赠送问诊'
}

function retInfo() {
  let URL
  if (location.hostname.includes('localhost') || location.hostname.includes('192.168')) {
    URL = 'http://test2a.everjiankang.com.cn' + '/api/global-api/global-platform/phoneMapping/download?fileId='
  } else {
    URL = location.origin + '/api/global-api/global-platform/phoneMapping/download?fileId='
  }
  return URL
}
export const URL = retInfo()
