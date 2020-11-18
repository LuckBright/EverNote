// 系统消息类
import { MSGFROM, SYSTEMMSGTYPE, LIVE_TYPE } from './config'

export default class MsgClassCustom {
  constructor (msg, from) {
    const { type, show, content, msgRoomId } = msg
    this.systemType = type // 类型
    this.systemShow = show // 展示
    this.systemData = {}
    if (type === SYSTEMMSGTYPE[1]) { // ============= 视频 =============
      this.systemData.type = content.type
      if (content.info) {
        this.systemData.text = content.info[localStorage.getItem('roleType')]
        if (content.type === LIVE_TYPE[2]) { // 视频状态调整
          this.systemData.status = content.info.status // 状态
          this.systemData.disconnected = content.info.disconnected // 是否断开
        }
      }
      if (from === MSGFROM[3]) this.systemData.opposite = true
    } else if (type === SYSTEMMSGTYPE[2]) { // ============= 图文 - 问题 =============
      this.systemData.id = content.id
      if (content.info) {
        this.systemData.question = content.info.question // 问题
        if (content.info.images) { // 图片
          this.systemData.images = content.info.images.split(',')
        } else {
          this.systemData.images = []
        }
        if (content.info.patientInfo) { // 患者信息
          this.systemData.age = content.info.patientInfo.age
          this.systemData.name = content.info.patientInfo.name
          this.systemData.mobile = content.info.patientInfo.mobile
          this.systemData.birthday = content.info.patientInfo.birthday
          this.systemData.tipName = msgRoomId.includes('G') ? '图文问诊' : '视频问诊'
        }
      }
    } else if (type === SYSTEMMSGTYPE[4]) { // ============= 图文 - 处方 =============
      this.systemData.id = content.recipeOrderId
      this.systemData.count = content.count
      this.systemData.text = content.text
      this.systemData.payStatus = content.payStatus
      this.systemData.visitNumber = content.visitNumber
    } else if (type === SYSTEMMSGTYPE[5]) { // ============= 图文 - 等待完成确认 =============
      if (content.info) this.systemData.id = content.info[localStorage.getItem('roleType')]
    } else if (type === SYSTEMMSGTYPE[6]) { // ============= 系统提示 =============
      if (content.info) this.systemData.text = content.info[localStorage.getItem('roleType')]
    } else if (type === SYSTEMMSGTYPE[7]) { // ============= 系统提示 =============
      if (content.info) this.systemData.text = content.info.user
    } else if (type === SYSTEMMSGTYPE[8]) { // ============= 系统公告 =============
      if (content.info && content.info.user) {
        this.systemData.subject = content.info.user.subject
        this.systemData.content = content.info.user.content
        this.systemData.title = content.info.user.title
        this.systemData.url = content.info.user.url
      }
    } else if (type === SYSTEMMSGTYPE[9]) {
      this.systemData = content
    } else if (type === SYSTEMMSGTYPE[10]) {
      this.systemData = content
    } else if (type === SYSTEMMSGTYPE[11]) {
      this.systemData = content
    } else if (type === SYSTEMMSGTYPE[12]) {
      this.systemData = content
    } else if (type === SYSTEMMSGTYPE[13]) {
      this.systemData = content
    }
  }
}
