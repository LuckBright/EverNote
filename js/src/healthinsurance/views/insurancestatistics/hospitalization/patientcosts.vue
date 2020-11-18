<template>
  <div class="query">
    <ever-form2 :schema="schema" v-model="obj" :isQuery="true" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <div class="middleLayer">
      <el-button class="btnRight" type="primary" size="small" @click="exportFile">数据导出</el-button>
    </div>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column label="患者姓名" prop></el-table-column>
      <el-table-column label="病案号" prop></el-table-column>
      <el-table-column label="费用总额" prop></el-table-column>
      <el-table-column label="医保支付" prop></el-table-column>
      <el-table-column label="医保中心" prop></el-table-column>
      <el-table-column label="科室" prop></el-table-column>
      <el-table-column label="床号" prop></el-table-column>
      <el-table-column label="医师" prop></el-table-column>
      <el-table-column label="在院天数" prop></el-table-column>
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
    label: '患者姓名',
    name: 'a'
  },
  {
    label: '病案号',
    name: 'b'
  },
  {
    label: '科室',
    name: 'c'
  },
  {
    label: '医保中心',
    name: 'd'
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
