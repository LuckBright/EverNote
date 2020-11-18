<template>
  <div class="layout_inner">
    <div class="frIframeSrc">
      <report-view-iframe code="RCM_close" :extUrlParams="extUrlParams" currentStyle="width:100%;border:0;height: calc(100vh)"></report-view-iframe>
    </div>
  </div>
</template>
<script>
import reportViewIframe from '@/bi/page/report.view.iframe'

export default {
  data () {
    return {
      extUrlParams: {
        userId: localStorage.getItem('USERID')
      }
    }
  },
  created () {
  },
  components: {
    reportViewIframe
  }
}
</script>
