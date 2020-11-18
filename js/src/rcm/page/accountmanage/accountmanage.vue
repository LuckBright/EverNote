<template>
  <div class="layout_box accountmanage_wrap">
    <router-view class="station_layout_wrap"></router-view>
  </div>
</template>

<script>
  import session from '@/util/session'
  export default {
    mixins: [session]
  }
</script>
