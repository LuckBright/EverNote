<!--
  用来刷新当前页面过渡组件
-->
<template>
</template>

<script>
import resetRouteMeta from '@/manages/mixin/resetroutemeta'
export default {
  mixins: [resetRouteMeta],
  mounted () {
    this.$router.replace(decodeURIComponent(this.$route.query.backUrl))
  },
  data () {
    return {
    }
  }
}
</script>

