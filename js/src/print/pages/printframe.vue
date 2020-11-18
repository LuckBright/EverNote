<template>
  <router-view></router-view>
</template>

<script>
import session from '@/util/session'
export default {
  data () {
    return {}
  },
  mixins: [session]
}
</script>
