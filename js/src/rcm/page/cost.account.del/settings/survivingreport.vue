<template>
  <div class="layout_inner settle_inner">
    <el-row>
      <el-col :span="24">
        <el-tabs type="card" v-model="activeName1" @tab-click="handleClick1">
          <el-tab-pane label="药品出库统计" name="1">
            <el-tabs v-model="activeName2" @tab-click="handleClick">
              <el-tab-pane label="药品处方出库明细" name="1"></el-tab-pane>
              <el-tab-pane label="药品领用出库明细" name="2"></el-tab-pane>
              <el-tab-pane label="药品出库汇总按品名" name="3"></el-tab-pane>
              <el-tab-pane label="药品出库汇总按科室" name="4"></el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="耗材出库统计" name="2">
            <el-tabs v-model="activeName3" @tab-click="handleClick">
              <el-tab-pane label="耗材处方出库明细" name="5"></el-tab-pane>
              <el-tab-pane label="耗材领用出库明细" name="6"></el-tab-pane>
              <el-tab-pane label="耗材出库汇总按品名" name="7"></el-tab-pane>
              <el-tab-pane label="耗材出库汇总按科室" name="8"></el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div style="padding: 0 20px 20px 20px">
          <report-view-iframe :code="code" currentStyle="width: 100%;border:0;height: calc(100vh - 260px)"></report-view-iframe>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import reportViewIframe from '@/bi/page/report.view.iframe'

let schema = []
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      activeName1: '1',
      activeName2: '1',
      activeName3: '5',
      queryObj: obj,
      biReportUrlUser: '',
      obj: {
        1: 'thc_warehouse.out_stock_drug_recipel_WYQ_20180629',
        2: 'thc_warehouse.out_stock_drug_use_WYQ_20180629',
        3: 'thc_warehouse.out_stock_drug_name_WYQ_20180629',
        4: 'thc_warehouse.out_stock_drug_provider_WYQ_20180629',
        5: 'thc_warehouse.out_stock_consumptive_recipel_WYQ_20180629',
        6: 'thc_warehouse.out_stock_consumptive_use_WYQ_20180629',
        7: 'thc_warehouse.out_stock_consumptive_name_WYQ_20180629',
        8: 'thc_warehouse.out_stock_consumptive_provider_WYQ_20180629'
      },
      code: 'out_stock_drug_recipel_WYQ_20180629'
    }
  },
  methods: {
    handleClick (tab) {
      this.code = this.obj[Number(tab.name)]
    },
    handleClick1 (tab) {
      this.handleClick({ name: tab.name === '1' ? this.activeName2 : this.activeName3 })
    }
  },
  created () {
    this.handleClick({ name: 1 })
  },
  components: {
    reportViewIframe
  }
}
</script>

