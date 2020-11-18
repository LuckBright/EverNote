<template>
  <!-- 自己 -->
  <div v-if="msgData.msgFrom === MSGFROM[2]" class="chat chat-right">
    <p class="text audio" :style="'width: ' + ((msgData.msgContent.second / 30) * 100 + 40) + 'px'"
     @click='playAudio(msgData)' >
      <span>{{msgData.msgContent.second}}''</span>
      <span class="audio-icon">
        <img v-if="currentAudio.msgRandom === msgData.msgRandom && msgData._step === 1" class="audio1" :src="IMGMAP.IM.audio1"/>
        <img v-else-if="currentAudio.msgRandom === msgData.msgRandom && msgData._step === 2" class="audio2" :src="IMGMAP.IM.audio2"/>
        <img v-else class="audio3" :src="IMGMAP.IM.audio3"/>
      </span>
    </p>
    <img v-if="msgData.msgHeadurl" class='avatar' :src='msgData.msgHeadurl.includes("http") ? msgData.msgHeadurl : URL + msgData.msgHeadurl' :preview='Math.random()'>
    <img v-else src="~@/titancare/assets/img/touxiang.png" class="avatar"/>
  </div>
  <!-- 对方 -->
  <div v-else-if="msgData.msgFrom === MSGFROM[3]" class="chat chat-left">
    <img v-if="msgData.msgHeadurl" class='avatar' :src='msgData.msgHeadurl.includes("http") ? msgData.msgHeadurl : URL + msgData.msgHeadurl' :preview='Math.random()'>
    <img v-else src="~@/titancare/assets/img/touxiang.png" class="avatar"/>
    <p class="text audio" :style="'width: ' + ((msgData.msgContent.second / 30) * 100 + 40) + 'px'"
      @click='playAudio(msgData)' >
      <span class="audio-icon">
        <img v-if="currentAudio.msgRandom === msgData.msgRandom && msgData._step === 1" class="audio1" :src="IMGMAP.IM.audio1"/>
        <img v-else-if="currentAudio.msgRandom === msgData.msgRandom && msgData._step === 2" class="audio2" :src="IMGMAP.IM.audio2"/>
        <img v-else class="audio3" :src="IMGMAP.IM.audio3"/>
      </span>
      <span>{{msgData.msgContent.second}}''</span>
    </p>
  </div>
</template>

<script>
import { MSGFROM, URL } from '../common/config'
import IMGMAP from '../assets/images'
import Bus from '../common/mq.bus'

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
      IMGMAP,
      MSGFROM,
      URL,
      currentAudio: '', // 当前音频
      currentRandom: ''
    }
  },
  created () {
    this.initEventListener()
  },
  methods: {
    // 初始化事件监听
    initEventListener () {
      Bus.$on('audioPlaying', this.listenAudioPlaying)
      Bus.$on('audioStoping', this.listenAudioStoping)
    },
    // 监听语音播放
    listenAudioPlaying () {
      this.handleClearInterval()
    },
    // 监听停止/报错
    listenAudioStoping () {
      this.currentRandom = ''
      this.handleClearInterval()
    },
    // 播放语音
    playAudio (item) {
      this.handleClearInterval()
      setTimeout(() => {
        this.$set(item, '_step', 3)
        this.currentAudio = item
        this.handlePlayAudio(item)
      }, 100)
    },
    // 处理播放
    handlePlayAudio (item) {
      if (this.currentRandom !== item.msgRandom) {
        this.currentRandom = item.msgRandom
        this.startPlayAudio(item)
      } else {
        this.currentRandom = ''
        Bus.$emit('mqStop', item.msgContent.url)
      }
    },
    // 开始播放
    startPlayAudio (item) {
      Bus.$emit('mqPlay', item.msgContent.url)
      this.intervalId = setInterval(() => {
        if (item._step === 3) {
          item._step = 1
        } else {
          item._step++
        }
      }, 500)
    },
    // 清除定时器
    handleClearInterval () {
      if (this.intervalId) clearInterval(this.intervalId)
      if (this.currentAudio) this.currentAudio._step = 3
    },
    // 卸载事件监听
    uninstallEventListener () {
      Bus.$off('audioPlaying', this.listenAudioPlaying)
      Bus.$off('audioStoping', this.listenAudioStoping)
    }
  },
  destroyed () {
    this.uninstallEventListener()
  }
}
</script>

<style lang="less">
  @import url("../assets/css/imchat.less");
  .text{
    cursor: pointer;
  }
</style>
