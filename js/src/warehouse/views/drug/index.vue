<template>
  <div class="page_layout_full_hidden layout_box">
    <router-view class="flex_column_full_hidden station_layout_wrap drugstore" :key="key"></router-view>
    <audio v-if="showAudio" :src="audioUrl" preload ref="audio"></audio>
  </div>
</template>
<script>
import './assets/index.scss'
import './assets/index.less'
import audioMixin from './mixin/audio.mixin'
import VuexMixin from './store'
export default {
  mixins: [audioMixin, VuexMixin],
  data () {
    return {
      key: null
    }
  },
  watch: {
    $route: {
      handler (route) {
        this.key = route.path
      },
      deep: true
    }
  }
}
</script>
