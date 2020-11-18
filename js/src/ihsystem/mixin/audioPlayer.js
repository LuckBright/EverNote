// 音频播放器

import Bus from '@/util/eventbus'

export default {
  data () {
    return {
      Bus,
      audioCtx: document.createElement('audio')
    }
  },
  created () {
    this.initEventListener()
  },
  methods: {
    // 初始化
    initEventListener () {
      Bus.$on('mqPlay', this.audioPlay) // 监听播放
      Bus.$on('mqStop', this.audioStop) // 监听停止
      this.audioCtx.onended = () => { // 播放完毕
        this.audioInit()
      }
      this.audioCtx.onpause = () => { // 播放暂停
        this.audioInit()
      }
      this.audioCtx.onerror = () => { // 播放出错
        this.audioInit()
      }
    },
    // 播放
    audioPlay (src) {
      this.audioCtx.src = src
      this.audioCtx.play()
      Bus.$emit('audioPlaying', src)
    },
    // 停止
    audioStop () {
      this.audioCtx.currentTime = 0
      this.audioCtx.pause()
    },
    // 重置
    audioInit () {
      // this.audioCtx.src = ''
      this.audioCtx.pause()
      Bus.$emit('audioStoping', this.audioCtx.src)
    },
    // 卸载事件监听
    uninstallEventListener () {
      Bus.$off('mqPlay', this.audioPlay) // 取消监听播放
      Bus.$off('mqStop', this.audioStop) // 取消监听停止
      this.audioStop()
    }
  },
  destroyed () {
    this.uninstallEventListener()
  }
}
