<template>
  <div class="amap-page-container">
    <div id="container" style=" height:100%"></div>
  </div>
</template>

<style>
  .amap-demo {
    height: 300px;
  }
</style>

<script>
  import api from './api.js'

  export default {
    name: 'amap-page',
    data () {
      return {
        api,
        center: '',
        text: '',
        geocoder: '',
        addressObj: {
          address: '',
          lng: '',
          lat: '',
        },
        latLng: '',
      }
    },
    mounted () {
      this.setMap()
    },
    methods: {
      setMap () {
        const self = this
        // self.center = new window.qq.maps.LatLng(39.916527, 116.397128);
        var map = new window.qq.maps.Map(document.getElementById('container'), {
          center: new window.qq.maps.LatLng(39.916527, 116.397128), // 地图的中心地理坐标。
          zoom: 15, // 地图的中心地理坐标。
        })
        self.geocoder = new window.qq.maps.Geocoder({
          complete: function (result) {
            map.setCenter(result.detail.location)
            self.addressObj.address = result.detail.address
            self.addressObj.lat = result.detail.location.lat
            self.addressObj.lng = result.detail.location.lng
          },
        })

        window.qq.maps.event.addListener(map, 'click', function (event) {
          self.text = event.latLng.lat + ',' + event.latLng.lng
          var latlngStr = self.text.split(',', 2)
          var lat = parseFloat(latlngStr[0])
          var lng = parseFloat(latlngStr[1])
          self.latLng = new window.qq.maps.LatLng(lat, lng)
          self.geocoder.getAddress(self.latLng)
          var marker = new window.qq.maps.Marker({
            position: event.latLng,
            map: map,
          })
          window.qq.maps.event.addListener(map, 'click', function (event) {
            marker.setMap(null)
          })
        })

        // 获取城市列表接口设置中心点
        let citylocation = new window.qq.maps.CityService({
          complete: function (result) {
            map.setCenter(result.detail.latLng)
          },
        })
        citylocation.searchLocalCity()
      },
    },
  }
</script>

<style lang="less">
  .amap-page-container {
    width: 95%;
    height: 400px;
    padding: 20px;
  }
</style>
