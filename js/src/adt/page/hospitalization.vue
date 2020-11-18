<template>
  <div class="layout_box follow_wrap">
    <router-view class="station_layout_wrap"></router-view>
  </div>
</template>

<script>
import session from '@/util/session'
import getmacId from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
export default {
  mixins: [session, getmacId]
}
</script>
<style scoped>
.layout_box {
  display: flex;
  height: 100%;
}
.station_layout_wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
