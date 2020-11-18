<template>
  <div class="ever-org-map">
    <div id="org-select-position"></div>
    <div class="input-wrap">
      <input type="text" id="map-input">
    </div>
  </div>
</template>
<script>
  let geocoder = {}
  // 需要通过jsonp的方式现实 关键字检索功能
  import mark from '@/assets/img/mark.svg'
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
        autoInput: null,
      }
    },
    created() {
      setTimeout(() => {
        this.initMap()
        this.bindInput()
      }, 1000)
    },
    methods: {
      bindInput () {
        const me = this
        // this.autoInput = new window.AMap.Autocomplete({ input: 'map-input' })
        window.AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Geocoder'], function() {
          const autoOptions = {
            // 城市，默认全国
            // city: '北京',
            // 使用联想输入的input的id
            input: 'map-input'
          }
          const autocomplete = new window.AMap.Autocomplete(autoOptions)
          // 逆地理编码，根据经纬度获取地址信息
          geocoder = new window.AMap.Geocoder(autoOptions)

          const placeSearch = new window.AMap.PlaceSearch({
            // city: '北京',
            map: me.map
          })
          window.AMap.event.addListener(autocomplete, 'select', function(e) {
            // TODO 针对选中的poi实现自己的功能
            placeSearch.search(e.poi.name, function (status, result) {
              // console.log(status, result, 'placeSearch callback')
              // 清除所有的覆盖物
              setTimeout(() => {
                me.map.clearMap()
                if (result.poiList && result.poiList.pois && result.poiList.pois.length) {
                  const lat = result.poiList.pois[0].location.lat
                  const lng = result.poiList.pois[0].location.lng
                  me.center = [lng, lat]
                  me.removeMarker()
                  me.createMarker()
                  me.$emit('input', {
                    lat, lng
                  })
                }
              }, 300)
            })
          })
        })
      },
      createMap() {
        this.map = new window.AMap.Map('org-select-position', {
          resizeEnable: true,
          center: this.center,
          zoom: 13
        })
      },
      initMap () {
        if (this.value.lat && this.value.lng) {
          // this.center = {
          //   lat: +this.value.lat,
          //   lng: +this.value.lng,
          // }
          this.center = [this.value.lng, this.value.lat]
          this.createMap()
          this.removeMarker()
          this.createMarker()
        } else {
          this.center = [116.397400, 39.907629]
          this.createMap()
        }
        const me = this
        this.map.on('click', function(evt) {
          const lat = evt.lnglat.getLat().toFixed(6)
          const lng = evt.lnglat.getLng().toFixed(6)
          me.center = [lng, lat]
          me.removeMarker()
          me.createMarker()
          me.$emit('input', {
            lat, lng
          })
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              me.$emit('getPosAddress', result.regeocode.formattedAddress)
            }
          })
        })
      },
      removeMarker () {
        if (this.marker) {
          this.marker.setMap(null)
          this.marker = null
        }
      },
      createMarker () {
        this.marker = new window.AMap.Marker({
          icon: mark,
          position: this.center,
          offset: new window.AMap.Pixel(-18, -33)
        })
        this.marker.setMap(this.map)
      },
    }
  }
</script>
<style scoped>
  .ever-org-map {
    position: relative;
  }
  #org-select-position {
    width: 700px;
    height: 400px;
  }
  #map-input {
    position: absolute;
    top: 20px;
    left: 20px;
  }
</style>
