<template>
  <div class="layout_box follow_wrap page_layout_full_hidden">
    <router-view class="station_layout_wrap flex_column_full_hidden"></router-view>
  </div>
</template>

<script>
import session from '../../util/session'
export default {
  mixins: [session]
}
</script>

