
<template>
  <div class="page_layout_full_hidden layout_box systemset_wrap">
    <keep-alive class="flex_column_full_hidden station_layout_wrap" v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view class="flex_column_full_hidden station_layout_wrap" v-else></router-view>
  </div>
</template>

<script>
import session from '@/util/session'
export default {
  mixins: [session]
}
</script>

