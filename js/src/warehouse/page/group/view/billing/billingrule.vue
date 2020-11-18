<template>
  <div class="layout_inner auto-scroll">
    <el-tabs  v-model="serviceType" @tab-click="handleClick">
      <el-tab-pane name="1" label="计费设置"></el-tab-pane>
      <el-tab-pane v-if="!isWarehouse" name="2" label="计费点设置"></el-tab-pane>
      <billingsetting v-if="serviceType=='1'"></billingsetting>
      <billingpoint v-if="serviceType=='2'"></billingpoint>
    </el-tabs>
  </div>
</template>
<script>
import billingpoint from './billingrule.point.vue'
import billingsetting from './billingrule.setting.vue'
export default {
  data () {
    return {
      serviceType: this.$route.query.isPoint ? '2' : '1',
      isWarehouse: this.$route.path.indexOf('warehouse') > -1
    }
  },
  methods: {
    handleClick ({name}) {
      this.serviceType = name
    }
  },
  components: {
    billingpoint,
    billingsetting
  }
}
</script>
<style lang="scss" scoped>
.report /deep/ .el-table__header-wrapper .el-checkbox:first-child {
  display: none !important;
}
.auto-scroll {
  flex: 1;
  overflow: auto;
}
</style>
