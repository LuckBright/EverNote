<template>
  <div class="layout_box form_wrap full">
    <router-view class="flex_column_full_hidden station_layout_wrap"></router-view>
  </div>
</template>

<script>
  import session from '@/util/session'
  export default {
    mixins: [session]
  }
</script>
