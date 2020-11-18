<template>
  <div :class="item.from === $route.query.creatorId ? 'chat-sender' : 'chat-receiver'">
    <div><img :src="photoUrl(item.avatar)"></div>
    <div class="msgbox audio" :style="'width: ' + ((item.payload.second / 60) * 200 + 50) + 'px'" @click="playAudio(item)">
      <div :class="item.from === $route.query.creatorId ? 'chat-left_triangle' : 'chat-right_triangle'"></div>
      <span class="text audio-icon">
        <img v-if="currentAudio.random === item.random && item._step === 1" class="audio1" :src="IMGMAP.IM.audio1"/>
        <img v-else-if="currentAudio.random === item.random && item._step === 2" class="audio2" :src="IMGMAP.IM.audio2"/>
        <img v-else class="audio3" :src="IMGMAP.IM.audio3"/>
      </span>
      <span class="text">{{item.payload.second}}''</span>
    </div>
  </div>
</template>

<script>
  import Bus from '@/util/eventbus'
  import { MSGFROM, URL } from '@/phr/util/models'
  import IMGMAP from '@/phr/assets/images'
  export default {
    props: ['item'],
    data () {
      return {
        URL,
        MSGFROM,
        IMGMAP,
        currentAudio: '',
        intervalId: '',
        avatar: require('@/assets/avtarbg.png')
      }
    },
    created () {
      this.$nextTick(_ => {
        this.initAudioListener()
      })
    },
    methods: {
      initAudioListener () {
        Bus.$on('audioPlaying', this.listenAudioPlaying)
        Bus.$on('audioStoping', this.listenAudioStoping)
      },
      // 监听语音播放
      listenAudioPlaying (src) {
        if (src !== (this.currentAudio.payload && this.currentAudio.payload.url)) {
          this.currentRandom = ''
          this.handleClearInterval()
        }
      },
      listenAudioStoping (src) {
        if (this.currentAudio.payload && (src === this.currentAudio.payload.url)) {
          this.currentRandom = ''
          this.handleClearInterval()
        }
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
        if (this.currentRandom !== item.random) {
          this.currentRandom = item.random
          this.startPlayAudio(item)
        } else {
          // console.log(item)
          Bus.$emit('mqStop', item.payload.url)
        }
      },
      // 开始播放
      startPlayAudio (item) {
        Bus.$emit('mqPlay', item.payload.url)
        this.intervalId = window.setInterval(() => {
          if (item._step === 3) {
            item._step = 1
          } else {
            item._step++
          }
        }, 500)
      },
      // 清除定时器
      handleClearInterval () {
        if (this.intervalId) {
          window.clearInterval(this.intervalId)
        }
        if (this.currentAudio) {
          this.currentAudio._step = 3
        }
      },
      // 卸载事件监听
      uninstallAudioListener () {
        Bus.$off('audioPlaying', this.listenAudioPlaying)
        Bus.$off('audioStoping', this.listenAudioStoping)
      },
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
    destroyed () {
      this.uninstallAudioListener()
    }
  }
</script>

<style scoped src="../assets/im.css"></style>
