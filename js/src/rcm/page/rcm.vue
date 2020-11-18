<template>
  <div class="layout_box rcm_wrap flex_layout_full">
    <router-view class="station_layout_wrap"></router-view>
  </div>
</template>

<script>
import session from '../../util/session'
import getmacId from '@/rcm/otmdiscomponent/mixins/getmacaddress.js'
export default {
  mixins: [session, getmacId]
}
</script>

