<template>
  <div :class="item.from === $route.query.creatorId ? 'chat-sender' : 'chat-receiver'">
    <div><img :src="photoUrl(item.avatar)"></div>
    <div class="msgbox">
      <div :class="item.from === $route.query.creatorId ? 'chat-left_triangle' : 'chat-right_triangle'"></div>
      <span class="text" v-if="parseContent.type === 'EMOJI'" v-html="parseContent.content"></span>
      <span class="text" v-if="parseContent.type === 'TEXT'">{{parseContent.content}}</span>
    </div>
  </div>
</template>
<script>
import { EMOJI_QQ, EMOJI_EXTRA } from '@/phr/util/emoji'
const EMOJI_REG1 = /\[[^[\]]+]/g
export default {
  props: ['item'],
  data () {
    return {
      EMOJI_QQ,
      EMOJI_EXTRA,
      avatar: require('@/assets/avtarbg.png')
    }
  },
  methods: {
    photoUrl (val) {
      let url = ''
      if (val && val.indexOf('http') > -1) {
        url = val
      } else if (val) {
        url = this.$ever.fileUrl2 + val
      } else {
        url = this.avatar
      }
      return url
    }
  },
  computed: {
    parseContent (val) {
      let content = this.item.payload.text
      let type
      if (EMOJI_REG1.test(content)) { // 包含表情
        type = 'EMOJI'
        let tempArr = content.match(EMOJI_REG1)
        tempArr.forEach(item => {
          if (EMOJI_QQ[item]) {
            content = content.replace(item, `<img class="emoji" width="24" src="${EMOJI_QQ[item]}"/>`)
          } else if (EMOJI_EXTRA[item]) {
            content = content.replace(item, `<img class="emoji" width="24" src="${EMOJI_EXTRA[item]}"/>`)
          }
        })
      } else {
        type = 'TEXT'
      }
      return {
        type,
        content
      }
    }
  }
}
</script>

<style scoped src="../assets/im.css"></style>
