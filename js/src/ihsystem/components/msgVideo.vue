<template>
  <div :class="item.from === $route.query.creatorId ? 'chat-sender' : 'chat-receiver'">
    <div><img :src="photoUrl(item.avatar)"></div>
    <div class="msgbox">
      <div :class="item.from === $route.query.creatorId ? 'chat-left_triangle' : 'chat-right_triangle'"></div>
        <span class="text" v-if="item.payload.data.content.info.doctor">
          {{item.payload.data.content.info.doctor}}
        </span>
        <span class="text" v-else-if="item.payload.data.content.info.resource">视频已取消</span>
        <span class="text el-icon-video-camera"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item'],
  data () {
    return {
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
  }
}
</script>

<style scoped src="../assets/im.css"></style>
<style scoped>
  .el-icon-video-camera {font-size: 16px; position: relative; top: 1px}
</style>
