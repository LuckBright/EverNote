
<template>
  <div class="layout_box manages_wrap" :class="{'page_layout_full_hidden': !$route.meta.notFull}">
    <keep-alive class="flex_column_full_hidden station_layout_wrap" :include="['material']">
      <router-view class="flex_column_full_hidden station_layout_wrap"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import session from '@/util/session'
import '@/manages/assets/index.scss'
export default {
  mixins: [session]
}
</script>
