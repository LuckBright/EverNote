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
      <el-table-column label="日结流水号" prop></el-table-column>
      <el-table-column label="日结类型" prop></el-table-column>
      <el-table-column label="应收金额" prop></el-table-column>
      <el-table-column label="医保结算" prop></el-table-column>
      <el-table-column label="其他结算" prop></el-table-column>
      <el-table-column label="医保退款" prop></el-table-column>
      <el-table-column label="其他退款" prop></el-table-column>
      <el-table-column label="日结时间" prop></el-table-column>
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
    label: '日结类型',
    comp: 'ever-select',
    props: {
      options: [{
        id: '1',
        name: '全部'
      },
      {
        id: '2',
        name: '挂号日结'
      }, {
        id: '3',
        name: '收费日结'
      }]
    }
  },
  {
    label: '登记时间',
    name: 'registerTime',
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
