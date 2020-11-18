<template>
  <reportiframe ref="reportiframe" :key="code" :reportCode="code" :cleanReport="true"></reportiframe>
</template>
<script>
import reportiframe from '@/bi/page/reportdetail/report.detail'

export default {
  data () {
    return {
      code: 'report_other_out_mzsfyrb'
    }
  },
  created () {
  },
  components: {
    reportiframe
  }
}
</script>
