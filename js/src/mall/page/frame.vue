<template>
  <div class="layout_box mall_wrap">
    <router-view class="station_layout_wrap"></router-view>
  </div>
</template>

<script>
  import session from '../../util/session'
  import '../assets/mall.css'
  import '../assets/goods.css'
  export default {
    mixins: [session]
  }
</script>
