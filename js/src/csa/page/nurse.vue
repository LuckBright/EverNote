<template>
  <div class="nurse">
   <show></show>
  </div>
</template>
<script>
import api from '@/csa/store/csaapi.js'
import show from '@/csa/page/show.vue'
export default {
  data () {
    return {
      api
    }
  },
  components: {
    show
  },
  created () {
  },
  methods: {},
}
</script>
<style lang="scss" scope>
.nurse {
 height: 100%;
}
</style>
