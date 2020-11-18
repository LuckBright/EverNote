<template>
  <!-- 系统 -->
  <div v-if="parseMsgData.systemType === SYSTEMMSGTYPE[6] || parseMsgData.systemType === SYSTEMMSGTYPE[7] || parseMsgData.systemType === SYSTEMMSGTYPE[8]" class="chat">
    <msg-system :msgData="parseMsgData"></msg-system>
  </div>
  <!-- 自己 -->
  <div v-else-if="msgData.msgFrom === MSGFROM[2]" class="chat chat-right">
    <msg-cus-live v-if="parseMsgData.systemType === SYSTEMMSGTYPE[1]" :msgData="parseMsgData.systemData"></msg-cus-live>
    <msg-cus-consult v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[2]" :msgData="parseMsgData.systemData"></msg-cus-consult>
    <msg-cus-prescription v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[4]" :msgData="parseMsgData.systemData"></msg-cus-prescription>
    <msg-cus-confirm v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[5]" :msgData="parseMsgData.systemData"></msg-cus-confirm>
    <msg-cus-ocr v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[11]" :msgData="parseMsgData.systemData"></msg-cus-ocr>
    <msg-cus-goods v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[9]" :msgData="parseMsgData.systemData"></msg-cus-goods>
    <msg-cus-survey v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[10]" :msgData="parseMsgData.systemData"></msg-cus-survey>
    <msg-cus-security v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[12]" :msgData="parseMsgData.systemData"></msg-cus-security>
    <msg-cus-medical v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[13]" :msgData="parseMsgData.systemData"></msg-cus-medical>
    <div v-else>未解析的消息</div>
    <img v-if="msgData.msgHeadurl" class='avatar' :src="msgData.msgHeadurl.includes('http') ? msgData.msgHeadurl : URL + msgData.msgHeadurl" :preview='Math.random()'>
    <img v-else src="~@/titancare/assets/img/touxiang.png" class="avatar"/>
  </div>
  <!-- 对方 -->
  <div v-else-if="msgData.msgFrom === MSGFROM[3]" class="chat chat-left">
    <img v-if="oppositeInfo.msgHeadurl" class="avatar" :src="oppositeInfo.msgHeadurl.includes('http') ? oppositeInfo.msgHeadurl : URL + oppositeInfo.msgHeadurl" :preview='Math.random()'>
    <img v-else src="~@/titancare/assets/img/touxiang.png" class="avatar"/>
    <msg-cus-live v-if="parseMsgData.systemType === SYSTEMMSGTYPE[1]" :msgData="parseMsgData.systemData"></msg-cus-live>
    <msg-cus-consult v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[2]" :msgData="parseMsgData.systemData"></msg-cus-consult>
    <msg-cus-prescription v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[4]" :msgData="parseMsgData.systemData"></msg-cus-prescription>
    <msg-cus-confirm v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[5]" :msgData="parseMsgData.systemData"></msg-cus-confirm>
    <msg-cus-ocr v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[11]" :msgData="parseMsgData.systemData"></msg-cus-ocr>
    <msg-cus-goods v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[9]" :msgData="parseMsgData.systemData"></msg-cus-goods>
    <msg-cus-survey v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[10]" :msgData="parseMsgData.systemData"></msg-cus-survey>
    <msg-cus-security v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[12]" :msgData="parseMsgData.systemData"></msg-cus-security>
    <msg-cus-medical v-else-if="parseMsgData.systemType === SYSTEMMSGTYPE[13]" :msgData="parseMsgData.systemData"></msg-cus-medical>
    <div v-else>未解析的消息</div>
  </div>
</template>

<script>
import { MSGFROM, SYSTEMMSGTYPE, URL } from '../common/config'
import MsgClassCustom from '../common/msgClassCustom'
import msgCusPrescription from './msgCusPrescription'
import msgCusConsult from './msgCusConsult'
import msgCusConfirm from './msgCusConfirm'
import msgCusLive from './msgCusLive'
import msgSystem from './msgSystem'
import msgCusGoods from './msgCusGoods'
import msgCusSurvey from './msgCusSurvey'
import msgCusOcr from './msgCusOcr'
import msgCusSecurity from './msgCusSecurity'
import msgCusMedical from './msgCusMedical'

export default {
  components: {
    msgSystem,
    msgCusLive,
    msgCusConsult,
    msgCusConfirm,
    msgCusPrescription,
    msgCusOcr,
    msgCusGoods,
    msgCusSurvey,
    msgCusSecurity,
    msgCusMedical
  },
  props: {
    msgData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    oppositeInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      MSGFROM,
      SYSTEMMSGTYPE,
      URL
    }
  },
  computed: {
    parseMsgData () {
      this.msgData.msgContent.msgRoomId = this.msgData.msgRoomId
      return new MsgClassCustom(this.msgData.msgContent, this.msgData.msgFrom)
    }
  }
}
</script>
<style lang="less">
  @import url("../assets/css/imchat.less");
</style>
