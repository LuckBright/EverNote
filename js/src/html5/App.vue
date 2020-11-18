<template>
  <router-view></router-view>
</template>

<script>
import nprogress from 'nprogress'

export default {
  name: 'html5',
  watch: {
    '$store.state.pending': function (num) {
      if (num > 0) {
        nprogress.start()
      }
      if (num === 0) {
        nprogress.done()
      }
    }
  }
}
</script>
