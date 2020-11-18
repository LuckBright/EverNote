<template>
  <div class="container layout_box inpatient_wrap">
    <div class="layout_main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import session from '@/util/session'
export default {
  mixins: [session]
}
</script>
