<template>
  <div>
    <el-dialog
      :title="title + '　支付流水'"
      :visible.sync="v"
      class="ui_dialog_02 dailytosettlecode"
      width="70%"
    >
      <div>
        <!-- <h3 class="print_header">{{title}}</h3> -->
        <el-table :data="flowfeeData" tooltip-effect="dark" id="printTable">
          <el-table-column prop="patientName" label="患者"></el-table-column>
          <el-table-column prop label="支付时间">
            <template slot-scope="scope">
              <div v-if="isHospitali">
                <span v-if="scope.row.operateTime">{{scope.row.operateTime}}</span>
                <span v-else-if="scope.row.payTime">{{scope.row.payTime}}</span>
              </div>
              <span v-else-if="scope.row.updateTime">{{scope.row.updateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="金额" align="right">
            <template slot-scope="scope">
              <span v-if="scope.row.flowfee">{{scope.row.flowfee | formatToFinacial}}</span>
              <span v-else-if="scope.row.flowFee">{{scope.row.flowFee | formatToFinacial}}</span>
              <span v-else>0.00</span>
            </template>
          </el-table-column>
          <el-table-column label="操作员" prop="createUser"></el-table-column>
          <el-table-column prop label="结算单号">
            <template slot-scope="scope">
              <div v-if="isHospitali">
                <span
                  v-if="!isBtn&&scope.row.settlementType!=0"
                  @click="handelHospitali(scope.row)"
                  class="statement_number"
                >{{scope.row.settleCode}}</span>
                <span v-else>{{scope.row.settleCode}}</span>
              </div>
              <a
                v-else
                href="javascript:void(0)"
                @click="settlementDetail(scope.row)"
              >{{scope.row.settleCode}}</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import api from '@/rcm/store/income/reportForms'
export default {
  props: ['dialogtosettle', 'title', 'flowfeeData', 'isHospitali', 'isBtn'],
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
      sourceType: {
        1: 'daily',
        2: 'half'
      }
    }
  },
  methods: {
    handelHospitali (data) {
      let source = this.sourceType[data.settlementType]
      if (!source) return
      window.open(`${this.$ever.adtIndex}/adt/hospitalSettle/settlementQuery/detail?patientId=${data.patientId}&ipNo=${data.ipNo}&settlementId=${data.settlementId}&source=${source}`)
    },
    settlementDetail (row) {
      window.open(`${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${row.patientid}&visitNumber=${row.rootorderid}&showDetail=0&settlementid=${row.settlementid}&dptId=${row.orderDept}&showlist=true`)
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

