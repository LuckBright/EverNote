<template>
  <baidu-map
    id="map"
    :ak="sk"
    :style="mapStyle"
    :map-click="false"
    :center="center"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    :double-click-zoom="false"
    @click="getPosition">
    <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
    <bm-control class="bmCon">
      <el-input v-model="keyword" placeholder="搜索地址"></el-input>
    </bm-control>
    <bm-local-search :keyword="keyword" :auto-viewport="true" :pageCapacity="1" :panel="false"></bm-local-search>
    <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" show-address-bar auto-location />
    <bm-marker v-if="value.lng && value.lat" :position="value"></bm-marker>
  </baidu-map>
</template>

<script>
// https://dafrok.github.io/vue-baidu-map/#/zh/map/baidu-map
import staticVars from '@/store/staticvars.js'
import { BaiduMap, BmView, BmLocalSearch, BmMarker, BmGeolocation, BmControl } from 'vue-baidu-map'

export default {
  components: {
    BaiduMap,
    BmView,
    BmLocalSearch,
    BmMarker,
    BmGeolocation,
    BmControl
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    },
    width: {
      type: [Number, String],
      default: '700px'
    },
    height: {
      type: [Number, String],
      default: '400px'
    },
  },
  data () {
    return {
      mapStyle: {
        width: this.width,
        height: this.height
      },
      zoom: 13,
      keyword: '',
      sk: staticVars.baiduMapSK,
      center: '北京',
      mapshow: false,
    }
  },
  created () {
    if (this.value.lat && this.value.lng) {
      this.center = this.value
    }
  },
  methods: {
    getPosition (e) {
      this.$emit('input', e.point)
    },
  },
}
</script>
<style scoped>
.bmCon{margin: 10px}
</style>
