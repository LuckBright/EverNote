<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
const size = {
  small: { width: '150px', height: '100px', },
  big: { width: '680px', height: '700px', },
}
export default {
  name: 'VideoPlayer',
  props: {
    src: String,
    size: String,
    autoplay: Boolean
  },
  data () {
    return {
      player: null,
      options: {
        preload: 'auto',
        autoplay: this.autoplay || false,
        muted: false,
        ...size[this.size],
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
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () { })
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style>
.video-js .vjs-big-play-button {
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
.video-js .vjs-subs-caps-button {
  display: none;
}
</style>
