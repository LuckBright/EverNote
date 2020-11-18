<template>
  <div class="layout_inner">
    <div class="frIframeSrc">
      <reportiframe ref="reportiframe" :key="code" :reportCode="code" :cleanReport="false"></reportiframe>
    </div>
  </div>
</template>
<script>
import reportiframe from '@/bi/page/reportdetail/report.detail'

export default {
  data () {
    return {
      code: 'report_other_ip_zysfcxbb'
    }
  },
  created () {
  },
  components: {
    reportiframe
  }
}
</script>
