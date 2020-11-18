<template>
  <div class="query">
    <ever-form2 :schema="schema" v-model="obj" :isQuery="true" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <h2>医保医疗费信息汇总</h2>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="医疗费总额" prop='totalFee'></el-table-column>
      <el-table-column label="账户支付合计" prop='accountPay'></el-table-column>
      <el-table-column label="现金支付合计" prop='cashPay'></el-table-column>
      <el-table-column label="统筹基金支付合计" prop='fundPay'></el-table-column>
      <el-table-column label="大病支付合计" prop='seriousDiseasePay'></el-table-column>
      <el-table-column label="公务员补助合计" prop='servantSubsidy'></el-table-column>
      <el-table-column label="伤残军人补助合计" prop='disableSoldierSubsidy'></el-table-column>
    </el-table>
    <h2 class="mt20 mb20">院内医疗费信息汇总</h2>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="医疗费总额" prop></el-table-column>
      <el-table-column label="账户支付合计" prop></el-table-column>
      <el-table-column label="现金支付合计" prop></el-table-column>
      <el-table-column label="统筹基金支付合计" prop></el-table-column>
      <el-table-column label="大病支付合计" prop></el-table-column>
      <el-table-column label="公务员补助合计" prop></el-table-column>
      <el-table-column label="伤残军人补助合计" prop></el-table-column>
    </el-table>
    <!-- <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination> -->
  </div>
</template>

<script>
// import list from '@/util/list'
import {
  medicalExpensesSummary
} from '@/healthinsurance/store/syyb.insurance.js'
let schema = [
  {
    label: '统计时间',
    name: 'time',
    comp: 'everRangePicker',
    props: {
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  },
  {
    label: '',
    name: 'btns',
    labelWidth: '15px',
    comp: 'custom'
  }
]
export default {
  // mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      tableData: []
    }
  },
  methods: {
    list () {
      let params = {}
      if (this.obj.time[0]) {
        params['beginDate'] = this.$moment(this.obj.time[0]).format('YYYYMMDD')
        params['endDate'] = this.$moment(this.obj.time[1]).format('YYYYMMDD')
      }
      medicalExpensesSummary(params).then(rs => {
        if (!rs.head.errCode) {
          this.tableData = rs.data
        }
      })
    },
    resetForm () {
      this.$refs.form.$refs.form.resetForm()
    }
  },
}
</script>
<style scoped>
.query {
  width: 100%;
}
.middleLayer {
  text-align: right;
}
</style>
