<template>
  <div class="page_layout_full_hidden layout_box">
    <router-view class="flex_column_full_hidden station_layout_wrap oa"></router-view>
  </div>
</template>

<script>
  import session from '../../util/session'
  export default {
    mixins: [session]
  }
</script>

