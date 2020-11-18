// 音频播放器

import Bus from '@/util/eventbus'
import { URL } from '../util/models'

export default {
  data () {
    return {
      Bus,
      audioCtx: document.createElement('audio'),
      URL
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
      this.audioCtx.addEventListener('ended', _ => {
        console.log(this.audioCtx, '播放完了')
        this.audioInit()
      })
      /*
      this.audioCtx.onended = () => { // 播放完毕
        console.log(this.audioCtx, '播放完了')
        this.audioInit()
      }
      */
      this.audioCtx.onpause = () => { // 播放暂停
        this.audioInit()
      }
      this.audioCtx.onerror = () => { // 播放出错
        this.audioInit()
      }
    },
    // 播放
    audioPlay (src) {
      const url = src.includes('http') ? src : URL + src
      this.audioCtx.src = url
      this.audioCtx.play()
      console.log('开始播放', this.audioCtx.src)
      Bus.$emit('audioPlaying')
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
      Bus.$emit('audioStoping')
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
