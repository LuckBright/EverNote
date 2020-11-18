<template>
  <div class="layout_box financial_wrap">
    <router-view :key="$route.meta && $route.meta.type" class="station_layout_wrap"></router-view>
  </div>
</template>
<!--<div class="page_layout_full_hidden layout_box manages_wrap">
    <router-view class="flex_column_full_hidden station_layout_wrap"></router-view>
  </div>-->

<script>
import session from '../../util/session'
export default {
  mixins: [session]
}
</script>
