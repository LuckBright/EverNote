<template>
  <!-- 自己 -->
  <div v-if="msgData.msgFrom === MSGFROM[2]" class="chat chat-right">
    <img class="image" :src="msgData.msgContent[IMAGE_SIZE[0]].includes('http') ? msgData.msgContent[IMAGE_SIZE[0]] : URL + msgData.msgContent[IMAGE_SIZE[0]]" :preview='Math.random()'>
    <img v-if="msgData.msgHeadurl" class="avatar" :src="msgData.msgHeadurl.includes('http') ? msgData.msgHeadurl : URL + msgData.msgHeadurl" :preview='Math.random()'>
    <img v-else src="~@/titancare/assets/img/touxiang.png" class="avatar"/>
  </div>
  <!-- 对方 -->
  <div v-else class="chat chat-left">
    <img v-if="msgData.msgHeadurl" class="avatar" :src="msgData.msgHeadurl.includes('http') ? msgData.msgHeadurl : URL + msgData.msgHeadurl" :preview='Math.random()'>
    <img v-else src="~@/titancare/assets/img/touxiang.png" class="avatar"/>
    <img class="image" :src="msgData.msgContent[IMAGE_SIZE[0]].includes('http') ? msgData.msgContent[IMAGE_SIZE[0]] : URL + msgData.msgContent[IMAGE_SIZE[0]]" :preview='Math.random()'>
  </div>
</template>

<script>
import { MSGFROM, IMAGE_SIZE, URL } from '../common/config'

export default {
  props: {
    msgData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      MSGFROM,
      IMAGE_SIZE,
      URL
    }
  }
}
</script>

<style lang="less">
  @import url("../assets/css/imchat.less");
</style>
