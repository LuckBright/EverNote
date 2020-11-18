<template>
  <router-view></router-view>
</template>

<script>
import session from '../../util/session'
import '../assets/message.css'
export default {
  data () {
    return {}
  },
  mixins: [session]
}
</script>
