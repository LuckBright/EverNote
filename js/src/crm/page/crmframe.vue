<template>
  <div class="layout_box crm_wrap">
    <router-view class="flex_column_full_hidden station_layout_wrap"></router-view>
  </div>
</template>

<script>
import session from '../../util/session'
import '../assets/workspace.css'
export default {
  data () {
    return {
      callData: ''
    }
  },
  mixins: [session]
}
</script>

