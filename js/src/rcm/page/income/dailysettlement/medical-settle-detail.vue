<template>
  <el-dialog
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="85%"
  >
    <div class="title">
      <h2>医保费用明细</h2>
      <div class="btn">
        <el-button
          type="primary"
          size="small"
          :disabled="tableData.length<=0"
          @click="printMedicalSettle"
        >打印</el-button>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="dataTop">
      <el-row>
        <el-col :span="8">
          <span class="label">日结时间：</span>
          <span>{{settleObj.startTime || '--'}} 至 {{settleObj.endTime || '--'}}</span>
        </el-col>
        <el-col :span="8">
          <span class="label">日结人：</span>
          <span>{{settleObj.cashier}}</span>
        </el-col>
        <el-col :span="8">
          <span class="label">日结编号：</span>
          <span>{{settleObj.closeCode}}</span>
        </el-col>
        <div class="clearfix"></div>
      </el-row>
    </div>
    <el-table :data="tableData" border stripe height="500px">
      <el-table-column label="保险类别" prop="insuranceOrgName" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="人员类别" prop="treateTypeName"></el-table-column>
      <el-table-column label="统筹地区" prop="overallAreaName"></el-table-column>
      <el-table-column label="个人现金" prop="cash">
        <template slot-scope="scope">{{scope.row.cash | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="账户" prop="personcountpay">
        <template slot-scope="scope">{{scope.row.personcountpay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="统筹" prop="overallPay">
        <template slot-scope="scope">{{scope.row.overallPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="大额保险" prop="salvageFundPay">
        <template slot-scope="scope">{{scope.row.salvageFundPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="公务员补助" prop="functionarySubsidyPay">
        <template slot-scope="scope">{{scope.row.functionarySubsidyPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="公务员基本医疗" prop="hosSelfpayGB">
        <template slot-scope="scope">{{scope.row.hosSelfpayGB | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="保健对象" prop="healthcareSubsidyFee">
        <template slot-scope="scope">{{scope.row.healthcareSubsidyFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="离休统筹" prop="retireOverall">
        <template slot-scope="scope">{{scope.row.retireOverall | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="工伤保险" prop="injuryOverallPay">
        <template slot-scope="scope">{{scope.row.injuryOverallPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="生育保险" prop="birthOverallPay">
        <template slot-scope="scope">{{scope.row.birthOverallPay | formatToFinacial}}</template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { getMedicalList } from '@/rcm/store/income/dailysettlementapi.js'
import { everprint } from '@/util/common'
export default {
  props: ['visible'],
  data () {
    return {
      settleObj: {},
      tableData: []
    }
  },
  methods: {
    getlist () {
      let params = {
        settlementType: this.$route.params.feeType,
        closeId: this.$route.query.id,
      }
      getMedicalList(params).then(res => {
        this.settleObj = res.data
        this.tableData = res.data.medicalDetails
      }, err => { console.log('err', err) })
    },
    printMedicalSettle () {
      let params = {
        settlementType: this.$route.params.feeType,
        closeId: this.$route.query.id,
      }
      everprint('rcm_medical_settle', params, { preview: true })
    }
  },
  created () {
    this.getlist()
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  text-align: center;
  h2 {
    display: inline-block;
  }
  .btn {
    float: right;
    margin-right: 20px;
  }
}
.dataTop {
  .label {
    font-size: 14px;
    font-weight: bold;
    color: #000;
  }
}
.clearfix {
  clear: both;
}
</style>
