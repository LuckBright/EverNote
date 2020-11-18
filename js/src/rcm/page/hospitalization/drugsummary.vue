<template>
  <div class="layout_inner">
    <report-view-runqian rqCode="report_sale_ip_yphchz"></report-view-runqian>
  </div>
</template>
<script>
import reportViewRunqian from '@/bi/page/reportdetail/report.view.runqian.vue'

export default {
  data () {
    return {}
  },
  created () {
  },
  components: {
    reportViewRunqian
  }
}
</script>
<style scoped>
.frIframeSrc{
  height:100vh;
}
</style>
