<template>
  <div class="layout_inner">
    <el-tabs  v-model="serviceType" @tab-click="handleClick">
      <el-tab-pane name="801" label="检验报告解读"></el-tab-pane>
      <el-tab-pane name="800" label="检查报告解读"></el-tab-pane>
      <reportlist ref='reportlist' :serviceType='serviceType'></reportlist>
    </el-tabs>
  </div>
</template>
<script>
import reportlist from '@/arrange/page/reservation/report.list.vue'
export default {
  data () {
    return {
      serviceType: '801'
    }
  },
  methods: {
    handleClick ({name}) {
      this.serviceType = name
    }
  },
  components: {
    reportlist
  }
}
</script>
<style lang="scss" scoped>
.report /deep/ .el-table__header-wrapper .el-checkbox:first-child {
  display: none !important;
}
</style>
