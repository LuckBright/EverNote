// 消息类
import { MSGTYPE, MSGFROM, SYSTEMMSGTYPE, LIVE_TYPE } from './models'

const CUSTOM_TYPE_ARR = Object.values(SYSTEMMSGTYPE) // 可解析的自定义消息类型

export default class MsgClass {
  constructor (msgType, msgRandom, msgTime, msgSeq, msgRoomId, msgAccount, msgNick, msgHeadurl, msgUnread, msgContent, msgTimeStamp, msgRevoked) {
    this.msgTimeStamp = msgTimeStamp // 历史消息时间
    this.msgSeq = msgSeq // 队列
    this.msgTime = msgTime // 时间
    this.msgNick = msgNick // 昵称
    this.msgType = msgType // 类型
    this.msgDisplay = 1 // 消息默认显示
    this.msgRoomId = msgRoomId // 群号
    this.msgUnread = msgUnread // 未读数
    this.msgAccount = msgAccount // 账号
    this.msgHeadurl = msgHeadurl // 头像
    this.msgRandom = msgRandom // 随机数（唯一标志）
    this.msgRevoked = msgRevoked // 撤回
    if (msgAccount === MSGFROM[1]) { // admin
      this.msgFrom = MSGFROM[1]
    } else if (msgAccount === localStorage.getItem('roleId')) { // 自己
      this.msgFrom = MSGFROM[2]
    } else { // 对方
      this.msgFrom = MSGFROM[3]
    }
    if ([MSGTYPE.TEXT, MSGTYPE.IMAGE, MSGTYPE.AUDIO].includes(msgType)) { // 文本 || 图片 || 语音
      this.msgContent = msgContent
    } else if ([MSGTYPE.CUSTOM].includes(msgType)) { // 自定义
      this.msgContent = JSON.parse(msgContent)
      const { type, content } = this.msgContent
      if (type === SYSTEMMSGTYPE[1]) { // 视频
        if (content && content.type === LIVE_TYPE[1]) this.msgDisplay = 0 // 隐藏消息
      } else if (type === SYSTEMMSGTYPE[3]) { // 图文 - 接诊
        this.msgDisplay = 0 // 隐藏消息
      }
      if (!CUSTOM_TYPE_ARR.includes(type)) this.msgDisplay = 0 // 未知消息类型不显示
    }
  }
}
