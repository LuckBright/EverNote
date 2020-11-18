<template>
  <div class="videowrap">
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  name: 'VideoPlayer',
  props: {
    src: String,
    data: Object,
    shortVideo: Boolean
  },
  data () {
    return {
      player: null,
      options: {
        autoplay: true,
        controls: true,
        loop: false,
        language: 'zh-CN', // 设置语言
        poster: this.data ? this.data.videoFaceUrl : '',
        sources: [
          {
            type: 'application/x-mpegURL',
            src: this.src || this.data.playbackUrl
          }
        ],
      },
      shortVideoOption: {
        preload: 'auto',
        autoplay: false,
        muted: false,
        width: '340px',
        height: '640px',
        controls: true,
        controlBar: {
          volumePanel: { inline: false },
          remainingTimeDisplay: false
        },
        sources: [
          {
            type: 'video/mp4',
            src: this.src
          }
        ]
      }
    }
  },
  mounted () {
    const options = this.shortVideo ? this.shortVideoOption : this.options
    this.player = videojs(this.$refs.videoPlayer, options, function onPlayerReady () { })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang='less' scoped>
.videowrap {
  /deep/ .video-js .vjs-big-play-button {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    font-size: 2.5em;
    line-height: 1.3em;
    height: 1.5em;
    width: 1.5em;
    border-radius: 2.5em;
    background-color: #73859f;
    background-color: rgba(115, 133, 159, 0.5);
    border-width: 0.15em;
  }
  // /deep/ .video-js .vjs-big-play-button {
  //   height: 80px !important;
  //   width: 80px;
  //   line-height: 80px;
  //   border-radius: 40px;
  //   margin-left: -40px !important;
  //   margin-top: -40px !important;
  // }
}
</style>
