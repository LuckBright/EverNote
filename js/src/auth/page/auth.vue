<template>
  <div class="page_layout_full_hidden layout_box auth_wrap">
    <router-view class="flex_column_full_hidden station_layout_wrap"></router-view>
  </div>
</template>

<script>
  import session from '../../util/session'
  export default {
    mixins: [session]
  }
</script>

