<template>
  <div class="medicalfee">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :isQuery="true" @query="list"></ever-form2>
    <el-table :data="tableData" border stripe>
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
      <el-table-column label="自付比例" prop></el-table-column>
      <el-table-column label="自费原因" prop></el-table-column>
      <el-table-column label="超限价自付金额" prop></el-table-column>
      <el-table-column label="结算标志" prop></el-table-column>
      <el-table-column label="业务周期号" prop></el-table-column>
      <el-table-column label="发送方交易流水号" prop></el-table-column>
      <el-table-column label="接收方交易流水号" prop></el-table-column>
      <el-table-column label="处方明细" prop></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { medicalExpensesDetailQuery } from '@/rcm/store/otmdiscomponent/sysqzyy-api.js'
let schema = [{
  label: '就诊流水号',
  name: 'visitNumber',
},
{
  label: '',
  labelWidth: '15px',
  name: 'btns',
  comp: 'custom'
}]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      tableData: []
    }
  },
  methods: {
    list () {
      let params = {
        macId: this.macId,
        visitNumber: this.queryObj.visitNumber,
        insuranceOrgId: sysqzyyCode,
        param: this.queryObj.visitNumber
      }
      medicalExpensesDetailQuery(params).then(res => {
        this.tableData = res.data
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
}
</script>
<style scoped>
.medicalfee {
  width: 100%;
  overflow-x: auto;
}
</style>
