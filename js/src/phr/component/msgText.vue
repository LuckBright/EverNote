<template>
  <!-- 自己 -->
  <div v-if="msgData.msgFrom === MSGFROM[2]" class="chat chat-right">
    <div v-if="parseContent.type === 'emoji'" class="text" v-html="parseContent.content"></div>
    <div v-else-if="parseContent.type === 'text'" class="text">{{parseContent.content}}</div>
    <img v-if="msgData.msgHeadurl" class="avatar" :src="msgData.msgHeadurl.includes('http') ? msgData.msgHeadurl : URL + msgData.msgHeadurl" :preview='Math.random()'>
    <!-- <i v-else class="iconfont iconyishengtouxiang"></i> -->
    <img v-else src="../assets/img/touxiang.png" class="avatar"/>
  </div>
  <!-- 对方 -->
  <div v-else class="chat chat-left">
    <img v-if="msgData.msgHeadurl" class="avatar" :src="msgData.msgHeadurl.includes('http') ? msgData.msgHeadurl : URL + msgData.msgHeadurl" :preview='Math.random()'>
    <!-- <i v-else class="iconfont iconyishengtouxiang"></i> -->
    <img v-else src="../assets/img/touxiang.png" class="avatar"/>
    <div v-if="parseContent.type === 'emoji'" class="text" v-html="parseContent.content"></div>
    <div v-else-if="parseContent.type === 'text'" class="text">{{parseContent.content}}</div>
  </div>
</template>

<script>
import { EMOJI_QQ, EMOJI_EXTRA } from '../util/emoji'
import { MSGFROM, URL } from '../util/models'
// import { EMOJI_REG1 } from '../util/emoji.qq'
const EMOJI_REG1 = /\[[^[\]]+]/g

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
      URL
    }
  },
  computed: {
    parseContent () {
      let type
      let content = this.msgData.msgContent
      if (EMOJI_REG1.test(content)) { // 包含表情
        type = 'emoji'
        let tempArr = content.match(EMOJI_REG1)
        tempArr.forEach(item => {
          if (EMOJI_QQ[item]) {
            content = content.replace(item, `<img class="emoji" src="${EMOJI_QQ[item]}"/>`)
          } else if (EMOJI_EXTRA[item]) {
            content = content.replace(item, `<img class="emoji" src="${EMOJI_EXTRA[item]}"/>`)
          }
        })
      } else { // 纯文字
        type = 'text'
      }
      return {
        type,
        content
      }
    }
  }
}
</script>

<style lang="less">
  @import "../assets/less/imchat";
</style>
