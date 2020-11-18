<template>
  <router-view></router-view>
</template>

<script>
import session from '@/util/session'
import '../assets/login.less'
export default {
  mixins: [session],
}
</script>
