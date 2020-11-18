<template>
  <!-- 自己 -->
  <div v-if="msgData.msgFrom === MSGFROM[2]" class="chat chat-right">
    <img class="image" v-if="!msgData.msgContent[IMAGE_SIZE[0]].includes('https://')" :src="URL + msgData.msgContent[IMAGE_SIZE[0]]" :preview='Math.random()'>
    <img class="image" v-else :src="msgData.msgContent[IMAGE_SIZE[0]]" :preview='Math.random()'>
    <img v-if="msgData.msgHeadurl" class="avatar" :src="filterImage(msgData.msgHeadurl)" :preview='Math.random()'>
    <img v-else src="../assets/img/touxiang.png" class="avatar"/>
  </div>
  <!-- 对方 -->
  <div v-else class="chat chat-left">
    <img v-if="msgData.msgHeadurl" class="avatar" :src="msgData.msgHeadurl" :preview='Math.random()'>
    <img v-else src="../assets/img/touxiang.png" class="avatar"/>
    <img class="image" v-if="!msgData.msgContent[IMAGE_SIZE[0]].includes('https://')" :src="URL + msgData.msgContent[IMAGE_SIZE[0]]" :preview='Math.random()'>
    <img class="image" v-else :src="msgData.msgContent[IMAGE_SIZE[0]]" :preview='Math.random()'>
  </div>
</template>

<script>
import { MSGFROM, IMAGE_SIZE, URL } from '../util/models'

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
  },
  methods: {
    filterImage (val) {
      if (val.includes('http')) {
        return val
      } else {
        return URL + val
      }
    }
  }
}
</script>

<style lang="less">
  @import "../assets/less/imchat";
</style>
