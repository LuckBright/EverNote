<template>
  <router-view></router-view>
</template>

<script>
import session from '@/util/session'
export default {
  mixins: [session]
}
</script>
