<!--  任务审核 -->
<template>
  <div class="page_layout_full_hidden drugstore">
    <page-html :wmSprescribe="true"></page-html>
  </div>
</template>

<script>
import pageHtml from '@/warehouse/views/drug/multilibrary/audit/index.vue'
import { getUseFreq } from '@/warehouse/views/util/index.js'
import '@/warehouse/views/drug/assets/index.scss'
export default {
  components: {
    pageHtml
  },
  mounted () {
    getUseFreq()
  }
}
</script>
