<template>
  <div class="layout_inner">
    <ever-bread-crumb name="返回" :haveReturn="true"></ever-bread-crumb>
    <common-head
      v-if="$route.query.patientId"
      :patientId="$route.query.patientId"
      :visitNumber="$route.query.ipNo"
      code="010"
      :key="$route.query.patientId"
    ></common-head>
    <depositManage class="depositContainer"></depositManage>
  </div>
</template>

<script>
import commonHead from '@/inpatient/components/common.head.js'
import depositManage from '@/rcm/page/hospitalization/depositmanage'
export default {
  components: {
    commonHead,
    depositManage
  }
}
</script>
<style scoped>
.layout_inner {
  display: flex;
  flex-direction: column;
}
.depositContainer {
  overflow: auto;
}
</style>
