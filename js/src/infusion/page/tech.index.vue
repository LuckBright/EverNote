<template>
  <el-container style="height:100%">
    <el-main class="layout_box tech_wrap">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import session from '@/util/session'

export default {
  mixins: [session],
  data () {
    return {
      key: 1,
    }
  },
  mounted () {

  },
  methods: {
  },
  watch: {
  }
}
</script>
