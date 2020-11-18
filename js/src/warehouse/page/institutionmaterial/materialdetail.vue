<template>
  <div>
    <material-info :isClinic="true"></material-info>
  </div>
</template>
<script>
import materialInfo from '@/manages/page/material/material.info.vue'
import * as enumConfig from '@/util/common'
export default {
  data () {
    return {
      enumConfig
    }
  },
  created () {

  },
  beforeRouteEnter (to, from, next) {
    if (to.query.isBatch) {
      to.meta.thirdActiveIndex = '/warehouse/materiallists/batchpriceings'
    }
    next()
  },
  components: {
    materialInfo
  }
}
</script>

