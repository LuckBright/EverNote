<template>
  <div class="query">
    <ever-form2 :schema="querySchema" v-model="queryObj" :span="6">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button type="primary" size="small" @click="resetForm">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="middleLayer">
      <el-button type="primary" size="small" @click="calcSum">总计</el-button>
      <span>费用总额：</span>
      <span>{{totalFee | formatToFinacial}}</span>
      <span>医保支付总额：</span>
      <span>{{medicalTotalFee | formatToFinacial}}</span>
      <el-button class="btnRight" type="primary" size="small" @click="exportFile">数据导出</el-button>
    </div>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="结算单号" prop></el-table-column>
      <el-table-column label="费用总额" prop></el-table-column>
      <el-table-column label="医保支付" prop></el-table-column>
      <el-table-column label="医保中心" prop></el-table-column>
      <el-table-column label="结算单类型" prop></el-table-column>
      <el-table-column label="门诊档案号" prop></el-table-column>
      <el-table-column label="患者姓名" prop></el-table-column>
      <el-table-column label="年龄" prop></el-table-column>
      <el-table-column label="性别" prop></el-table-column>
      <el-table-column label="创建人" prop></el-table-column>
      <el-table-column label="结算日期" prop></el-table-column>
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
import { schema } from '@/healthinsurance/views/medicalcheck/settlementquery/query-schema.js'
let querySchema = Array.from(schema)
querySchema.splice(5, 1)
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema,
      queryObj,
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
.middleLayer .btnRight {
  float: right;
}
</style>
