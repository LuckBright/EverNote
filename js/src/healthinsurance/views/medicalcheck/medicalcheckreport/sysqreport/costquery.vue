<template>
  <div class="query">
    <ever-form2 :schema="schema" v-model="obj" :isQuery="true" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="定点医疗机构编码" prop></el-table-column>
      <el-table-column label="个人编码" prop></el-table-column>
      <el-table-column label="就诊流水号" prop></el-table-column>
      <el-table-column label="单据号" prop></el-table-column>
      <el-table-column label="交易类型" prop></el-table-column>
      <el-table-column label="发送方交易流水号" prop></el-table-column>
      <el-table-column label="接收方交易流水号" prop></el-table-column>
      <el-table-column label="医疗费总额" prop></el-table-column>
      <el-table-column label="本次账户支付" prop></el-table-column>
      <el-table-column label="统筹支付金额" prop></el-table-column>
      <el-table-column label="大病支付" prop></el-table-column>
      <el-table-column label="公务员补助一档支付" prop></el-table-column>
      <el-table-column label="公务员补助二档支付" prop></el-table-column>
      <el-table-column label="公务员补助支付" prop></el-table-column>
      <el-table-column label="伤残补助支付" prop></el-table-column>
      <el-table-column label="本次现金支付" prop></el-table-column>
      <el-table-column label="自费费用" prop></el-table-column>
      <el-table-column label="乙类自理费用" prop></el-table-column>
      <el-table-column label="超限价自付费用" prop></el-table-column>
      <el-table-column label="符合基本医疗费用" prop></el-table-column>
      <el-table-column label="起付标准自付" prop></el-table-column>
      <el-table-column label="进入统筹费用" prop></el-table-column>
      <el-table-column label="统筹分段自付" prop></el-table-column>
      <el-table-column label="进入大病费用" prop></el-table-column>
      <el-table-column label="进入公补费用" prop></el-table-column>
      <el-table-column label="大病报销费用" prop></el-table-column>
      <el-table-column label="公补一档个人自付" prop></el-table-column>
      <el-table-column label="公补二档个人自付" prop></el-table-column>
      <el-table-column label="公补个人自付" prop></el-table-column>
      <el-table-column label="超封顶线自付" prop></el-table-column>
      <el-table-column label="住院次数" prop></el-table-column>
      <el-table-column label="产前检查费" prop></el-table-column>
      <el-table-column label="开发商标识" prop></el-table-column>
    </el-table>
    <el-table class="mt20" :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="就诊流水号" prop></el-table-column>
      <el-table-column label="单据号" prop></el-table-column>
      <el-table-column label="医疗费总额" prop></el-table-column>
      <el-table-column label="本次账户支付" prop></el-table-column>
      <el-table-column label="统筹支付金额" prop></el-table-column>
      <el-table-column label="大病支付" prop></el-table-column>
      <el-table-column label="公务员补助一档支付" prop></el-table-column>
      <el-table-column label="公务员补助二档支付" prop></el-table-column>
      <el-table-column label="公务员补助支付" prop></el-table-column>
      <el-table-column label="伤残补助支付" prop></el-table-column>
      <el-table-column label="本次现金支付" prop></el-table-column>
      <el-table-column label="自费费用" prop></el-table-column>
      <el-table-column label="乙类自理费用" prop></el-table-column>
      <el-table-column label="超限价自付费用" prop></el-table-column>
      <el-table-column label="符合基本医疗费用" prop></el-table-column>
      <el-table-column label="起付标准自付" prop></el-table-column>
      <el-table-column label="进入统筹费用" prop></el-table-column>
      <el-table-column label="统筹分段自付" prop></el-table-column>
      <el-table-column label="进入大病费用" prop></el-table-column>
      <el-table-column label="进入公补费用" prop></el-table-column>
      <el-table-column label="大病报销费用" prop></el-table-column>
      <el-table-column label="公补一档个人自付" prop></el-table-column>
      <el-table-column label="公补二档个人自付" prop></el-table-column>
      <el-table-column label="公补个人自付" prop></el-table-column>
      <el-table-column label="超封顶线自付" prop></el-table-column>
      <el-table-column label="住院次数" prop></el-table-column>
      <el-table-column label="产前检查费" prop></el-table-column>
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
  medicalExpensesQuery
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
      medicalExpensesQuery(params).then(rs => {
        if (!rs.head.errCode) {
          this.tableData = rs.data
        }
      })
    },
    resetForm () {
      this.$refs.form.$refs.form.resetForm()
    }
  }
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
