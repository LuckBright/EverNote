<template>
  <div class="ever-org-map">
    <div id="org-select-position"></div>
    <div class="qq-map-search-box">
      <el-input v-model="keyword"></el-input>
      <ul>
        <li v-for="(item,index) in list" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  // 需要通过jsonp的方式现实 关键字检索功能
  import mark from '@/assets/img/mark.svg'
  // import axios from 'axios'
  export default {
    props: {
      value: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        map: null,
        center: {},
        marker: null,
        keyword: '',
        list: [],
      }
    },
    created() {
      setTimeout(() => {
        this.initMap()
      }, 1000)
    },
    watch: {
      keyword (v) {
        // O3MBZ-NQILW-ELORQ-OJKZV-IEMLK-FBFNB
        // axios.get(`https://apis.map.qq.com/uri/v1/search?keyword=${v}&center=39.977169,116.336954&region=北京&referer=O3MBZ-NQILW-ELORQ-OJKZV-IEMLK-FBFNB`).then(res => {
        //   console.log(res)
        // })
      }
    },
    methods: {
      createMap() {
        this.map = new window.TMap.Map('org-select-position', {
          center: this.center
        })
      },
      initMap () {
        if (this.value.lat && this.value.lng) {
          this.center = {
            lat: +this.value.lat,
            lng: +this.value.lng,
          }
          this.createMap()
          this.removeMarker()
          this.createMarker()
        } else {
          this.center = {
            lat: 39.907629,
            lng: 116.397400,
          }
          this.createMap()
        }
        const me = this
        this.map.on('click', function(evt) {
          const lat = evt.latLng.getLat().toFixed(6)
          const lng = evt.latLng.getLng().toFixed(6)
          me.center = {
            lat, lng
          }
          me.removeMarker()
          me.createMarker()
          me.$emit('input', me.center)
        })
      },
      removeMarker () {
        if (this.marker) {
          this.marker.setMap(null)
          this.marker = null
        }
      },
      createMarker () {
        this.marker = new window.TMap.MultiMarker({
          id: 'marker-layer',
          map: this.map,
          styles: {
            'marker': new window.TMap.MarkerStyle({
              'width': 24,
              'height': 24,
              'anchor': { x: 12, y: 26 },
              // 'src': 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png',
              'src': mark,
            })
          },
          geometries: [{
            'id': 'demo',
            'styleId': 'marker',
            'position': new window.TMap.LatLng(this.center.lat, this.center.lng),
            'properties': {
              'title': 'marker'
            }
          }]
        })
      }
    }
  }
</script>
<style scoped lang='less'>
  #org-select-position {
    width: 700px;
    height: 400px;
  }
</style>
