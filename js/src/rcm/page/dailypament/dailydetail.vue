<template>
  <el-dialog :visible.sync="v" width="80%" class="dailyDialog" top="5vh">
    <div class="dailyContainer">
      <outpatientDaily v-if="dailyType=='1'||dailyType=='2'"></outpatientDaily>
      <hospitalDailySingle v-if="dailyType=='3'||dailyType=='4'"></hospitalDailySingle>
      <hospitalDailyAll v-if="dailyType=='5'"></hospitalDailyAll>
    </div>
  </el-dialog>
</template>

<script>
import outpatientDaily from '@/rcm/page/income/dailysettlement/settlementinfo.vue'
import hospitalDailySingle from '@/rcm/page/income/hospitalizationday/hospitalizationdateform.vue'
import hospitalDailyAll from '@/rcm/page/income/hospitalizationday/hosdaily.vue'
export default {
  props: ['visible'],
  data () {
    return {
      dailyType: ''
    }
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    '$route.query': {
      handler: function (val) {
        if (val.dailyType) {
          this.dailyType = val.dailyType
        }
      },
      immediate: true
    }
  },
  components: {
    outpatientDaily, // 挂号和门诊日结的弹窗
    hospitalDailySingle, // 住院收费日结和预交金日结
    hospitalDailyAll // 住院总日结
  }
}
</script>
<style lang="less" scoped>
.dailyDialog {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.dailyContainer {
  height: 650px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  & /deep/ .layout_inner {
    overflow: auto;
  }
}
</style>
