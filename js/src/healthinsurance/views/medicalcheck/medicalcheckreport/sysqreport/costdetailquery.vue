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
      <el-table-column label="定点医疗机构编号" prop></el-table-column>
      <el-table-column label="就诊流水号" prop></el-table-column>
      <el-table-column label="单据号" prop></el-table-column>
      <el-table-column label="处方号" prop></el-table-column>
      <el-table-column label="医院收费项目内码" prop></el-table-column>
      <el-table-column label="医院收费项目名称" prop></el-table-column>
      <el-table-column label="中心收费项目内码" prop></el-table-column>
      <el-table-column label="中心收费项目名称" prop></el-table-column>
      <el-table-column label="交易类型" prop></el-table-column>
      <el-table-column label="个人编号" prop></el-table-column>
      <el-table-column label="处方日期" prop></el-table-column>
      <el-table-column label="结算日期" prop></el-table-column>
      <el-table-column label="收费类别" prop></el-table-column>
      <el-table-column label="收费项目等级" prop></el-table-column>
      <el-table-column label="收费项目种类" prop></el-table-column>
      <el-table-column label="单价" prop></el-table-column>
      <el-table-column label="数量" prop></el-table-column>
      <el-table-column label="金额" prop></el-table-column>
      <el-table-column label="自理金额" prop></el-table-column>
      <el-table-column label="最高限价" prop></el-table-column>
      <el-table-column label="自费金额" prop></el-table-column>
      <el-table-column label="自负比例" prop></el-table-column>
      <el-table-column label="自费原因" prop></el-table-column>
      <el-table-column label="超限价自负金额" prop></el-table-column>
      <el-table-column label="结算标志" prop></el-table-column>
      <el-table-column label="业务周期号" prop></el-table-column>
      <el-table-column label="发送方交易流水号" prop></el-table-column>
      <el-table-column label="接收方交易流水号" prop></el-table-column>
      <el-table-column label="处方明细ID" prop></el-table-column>
    </el-table>
    <ever-pagination
      :current="current"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
    ></ever-pagination>
  </div>
</template>

<script>
import list from '@/util/list'
let schema = [
  {
    label: '就诊流水号',
    name: 'no'
  },
  {
    label: '',
    name: 'btns',
    labelWidth: '15px',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      totalFee: 0,
      medicalTotalFee: 0
    }
  },
  methods: {
    calcSum () { },
    exportFile () { },
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
