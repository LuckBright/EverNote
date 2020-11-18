<template>
  <!-- 视频消息 -->
  <div class="text">
    <div class="mask" v-if="videoUrl" @click="visible = true"></div>
    <msgvideoplayer
      v-if="videoUrl"
      :src="videoUrl"
      size="small"
    ></msgvideoplayer>
    <template v-else-if="msgData.opposite && !videoUrl">
      <i class="iconfont iconshipin2 iconfont-rotate"></i>{{ msgData.text }}
    </template>
    <template v-else>
      {{ msgData.text }}<i class="iconfont iconshipin2"></i>
    </template>
    <videodiag :src="videoUrl" :visible.sync="visible"></videodiag>
  </div>
</template>

<script>
import req from '@/util/req'
import urlMap from '@/phr/api/urls'
import msgvideoplayer from '@/phr/component/msgvideoplayer'
import videodiag from '@/phr/component/videodiag'
const { get } = req
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
      videoUrl: '',
      visible: false
    }
  },
  components: {
    msgvideoplayer,
    videodiag
  },
  computed: {
    groupId () {
      return this.msgData.data && this.msgData.data.msgRoomId
    },
    roomId () {
      return this.msgData.data && this.msgData.data.msgContent && this.msgData.data.msgContent.content && this.msgData.data.msgContent.content.info && this.msgData.data.msgContent.content.info.roomId
    }
  },
  methods: {
    async getUrl () {
      if (!this.roomId) return
      const url = urlMap.getVideoUrl + this.groupId + '/' + this.roomId
      const res = await get(url)
      this.videoUrl = res.data && res.data.videoUrl
    }
  },
  created () {
    this.getUrl()
  }
}
</script>

<style lang="less" scoped>
.text {
  display: flex;
  align-items: center;
  .iconfont {
    width: auto;
    height: auto;
    line-height: normal;
    color: #191919;
    font-size: 17px;
  }
  .iconfont-rotate {
    transform: rotate(180deg);
  }
}
.mask {
  position: absolute;
  width: 152px;
  height: 117px;
  z-index: 1000;
  cursor: pointer;
}
</style>
