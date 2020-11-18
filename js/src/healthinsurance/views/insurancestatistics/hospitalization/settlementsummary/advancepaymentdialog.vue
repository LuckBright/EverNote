<template>
  <div>
    <el-dialog
      title="冲预交金日结详情"
      :visible.sync="v"
      class="ui_dialog_02 dailytosettlecode"
      width="50%"
    >
      <div>
        <el-table :data="flowfeeData" tooltip-effect="dark" id="printTable">
          <el-table-column prop="patientName" label="患者"></el-table-column>
          <el-table-column prop="settlementType" :formatter="formatSettlementType" label="结算类型"></el-table-column>
          <el-table-column prop label="金额" align="right">
            <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['flowfeeData', 'dialogtosettle'],
  computed: {
    v: {
      get () {
        return this.dialogtosettle
      },
      set (val) {
        this.$emit('update:dialogtosettle', val)
      }
    }
  },
  data () {
    return {
      settlementTypeMap: {
        1: '出院结算',
        2: '中途结算'
      }
    }
  },
  methods: {
    formatSettlementType (row) {
      return this.settlementTypeMap[row.settlementType]
    }
  }
}
</script>
<style scoped>
.ui_dialog_02.dailytosettlecode .el-dialog .el-dialog__body {
  padding-bottom: 30px;
}
.statement_number {
  cursor: pointer;
  color: #1c7bef;
}
</style>

