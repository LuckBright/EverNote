<template>
  <el-col class="report_card801">
    <div style="min-height:340px">
      <template v-if='report.executeChannel == 1'>
          <el-table v-if="report.resultItem.length>0" :data="report.resultItem" style="width: 100%" height="360">
            <el-table-column prop="inspectUnitName" label="项目名称"></el-table-column>
            <el-table-column prop="quantityValue" label="检验结果" width="200">
              <template slot-scope="scope">
                <!-- 定量值/定性值 -->
                <span  v-if="scope.row.quantityValue===scope.row.qualityValue" :class="{cRed :scope.row.qualityValue === '阳性'}" > {{scope.row.qualityValue}}</span>
                <span v-else>{{ scope.row.quantityValue}} 
                  <span :class="{cRed :scope.row.qualityValue === '阳性'}" > {{scope.row.qualityValue}}</span>
                </span>
                <span
                  class="leveldown"
                  v-if="scope.row.resultStatus && (scope.row.resultStatus ==='L' || scope.row.resultStatus ==='LL')"
                >↓</span>
                <span
                  class="levelup"
                  v-if="scope.row.resultStatus && (scope.row.resultStatus ==='H' || scope.row.resultStatus ==='HH')"
                >↑</span>
              </template>
            </el-table-column>
            <el-table-column prop="inspectUnit" label="单位" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="refValue" label="参考区间" width="120" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-button
            style="margin-top:10px;display:block;"
            v-if="report.pdfReportUrl && report.pdfReportUrl.length == 1"
          >
            <a :href="report.pdfReportUrl[0].url" target="_blank">查看pdf</a>
          </el-button>
          <el-popover
            v-if="report.pdfReportUrl && report.pdfReportUrl.length > 1"
            style="margin-top:10px;display:block;"
            placement="bottom-start"
            width="400"
            trigger="hover"
          >
            <div v-for="item in report.pdfReportUrl" :key="item.index">
              <a :href="item.url" target="_blank">{{item.relName}}</a>
            </div>
            <el-button slot="reference">查看pdf</el-button>
          </el-popover>
      </template>
      <reportcardtech v-else-if='report.executeChannel == 2' :report='report'></reportcardtech>
      <span v-else>
        <div style="padding-top: 180px; text-align: center">暂无报告</div>
      </span>
    </div>
  </el-col>
</template>
<script>
import reportcardtech from '@/workspace/components/report.card.tech.vue'
export default {
  props: ['report'],
  data () {
    return {
    }
  },
  created () {

  },
  components: {
    reportcardtech
  },
  watch: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.report_card801 {
  .levelup,
  .leveldown {
    margin-left: 10px;
    margin-top: -20px;
    color: #ee4433;
    font-size: 16px;
  }
  .leveldown {
    color: #35a000;
  }
}
</style>

