<template>
  <div>
    <comm-tree :api="api"></comm-tree>
  </div>
</template>

<script>
import commTree from '../components/commontree.vue'
import api from '../util/commentapi.js'
export default {
  data () {
    return {
      api
    }
  },
  components: {
    commTree
  }
}
</script>

