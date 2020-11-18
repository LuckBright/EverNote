<template>
  <div class="layout_box" :class="{'page_layout_full_hidden': !$route.meta.notFull}">
    <router-view class="flex_column_full_hidden station_layout_wrap"></router-view>
  </div>
</template>
<script>
import session from '@/util/session'
export default {
  name: 'quality_control_index',
  mixins: [session],
  data () {
    return {
    }
  },
  created () {
  }
}
</script>

