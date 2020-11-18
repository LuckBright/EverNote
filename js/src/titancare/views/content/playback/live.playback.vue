<!-- 直播回放 -->
<template>
<div class="layout-inner">
  <div class="live-playback">
    <videoplayer
      class="live-video"
      :data="data"
    ></videoplayer>
  </div>
</div>
</template>

<script>
import videoplayer from '@/titancare/views/content/live/customer/videoplayer'
export default {
  props: {
    data: Object
  },
  data () {
    return {}
  },

  components: {
    videoplayer
  },

  computed: {},

  mounted () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
.live-playback {
  height: calc(100vh - 12vh);;
  .live-video {
    padding: 20px;
    height: 95%;
    width: 55%;
    margin: 0 auto;
    /deep/ .video-js {
      width: 100%;
      height: 100%;
    }
    /deep/ .video-js .vjs-big-play-button {
      top: 46%;
      left: 46%;
    }
  }
}
</style>
