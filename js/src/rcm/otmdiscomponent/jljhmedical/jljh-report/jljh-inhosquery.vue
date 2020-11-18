<template>
  <div class="layout_inner">
    <ever-form2 ref="queryform" :schema="schema" :rules="rules" v-model="queryObj">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list">查询</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-table :data="tableData" border stripe>
      <el-table-column label="序号" prop type="index" width="60"></el-table-column>
      <el-table-column label="医疗类别" prop="curetype"></el-table-column>
      <el-table-column label="门诊流水号" prop="visitNumber" width="100"></el-table-column>
      <el-table-column label="收据号" prop="feeno"></el-table-column>
      <el-table-column label="交易类型" prop="dealype">
        <template slot-scope="scope">{{scope.row.dealype>0?'正交易':'负交易'}}</template>
      </el-table-column>
      <el-table-column label="结算日期" prop="tradedate"></el-table-column>
      <el-table-column label="入院疾病编码" prop="diagnosisCode"></el-table-column>
      <el-table-column label="入院诊断疾病名称" prop="diagnosisName"></el-table-column>
      <el-table-column label="科室名称" prop="sectionname"></el-table-column>
      <el-table-column label="入院时间" prop="billdate" width="90">
        <template slot-scope="scope">{{scope.row.billdate | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="出院时间" prop="endBilldate" width="90">
        <template slot-scope="scope">{{scope.row.endBilldate | timeFormatter}}</template>
      </el-table-column>
      <el-table-column label="费用合计" prop="totalFee">
        <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="账户支付" prop="personcountpay">
        <template slot-scope="scope">{{scope.row.personcountpay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="统筹支付" prop="overallPay">
        <template slot-scope="scope">{{scope.row.overallPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="个人支付" prop="selfpay">
        <template slot-scope="scope">{{scope.row.selfpay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="公务员统筹支付" prop="functionarySubsidyPay">
        <template slot-scope="scope">{{scope.row.functionarySubsidyPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="离休统筹支付" prop="leaveSubsidyPay">
        <template slot-scope="scope">{{scope.row.leaveSubsidyPay | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="工伤统筹支付" prop="injuryJobFee">
        <template slot-scope="scope">{{scope.row.injuryJobFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="生育统筹支付" prop="babyFee">
        <template slot-scope="scope">{{scope.row.babyFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="本次事业工伤统筹支付" prop="thisInjuryJobFee">
        <template slot-scope="scope">{{scope.row.thisInjuryJobFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="本次照顾费统筹支付" prop="thisTakeFee">
        <template slot-scope="scope">{{scope.row.thisTakeFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="目录内费用合计" prop="basicMedicalFee">
        <template slot-scope="scope">{{scope.row.basicMedicalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="起付线" prop="minFee">
        <template slot-scope="scope">{{scope.row.minFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="基本医疗是否封顶" prop="isCapp">
        <template slot-scope="scope">{{scope.row.isCapp>0?'已封顶':'未封顶'}}</template>
      </el-table-column>
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
import { queryHospitalSettement } from '@/rcm/store/otmdiscomponent/jljh-api.js'
import { jljhCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import list from '@/util/list'
import DetailDialog from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/settlement-detail.vue'
import personno from '@/rcm/otmdiscomponent/personno.vue'
const schema = [{
  label: '个人编号',
  name: 'personno',
  comp: personno,
  props: {
    insuranceOrgId: jljhCode
  },
  span: 6
},
{
  label: '查询时间',
  name: 'queryDate',
  comp: 'everRangePicker',
  span: 6,
  props: {
    defaultTime: [],
    noclear: true,
    autoWidth: true
  }
},
{
  label: '',
  name: 'btns',
  labelWidth: '15px',
  comp: 'custom',
  span: 6
}]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    let endDay = this.$moment()
    let startDay = this.$moment(endDay).add('month', -1)
    queryObj.queryDate = [startDay, endDay]
    queryObj.requestSwitch = true
    return {
      schema,
      queryObj,
      rules: {
        personno: [{
          required: true,
          message: '请先选择个人编号',
          trigger: 'change'
        }]
      },
      tableData: [],
      currentRow: {},
      insuranceOrgId: jljhCode,
      hospitalNo: orgList[jljhCode]['HosCode']
    }
  },
  methods: {
    list (refresh) {
      this.$refs.queryform.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (refresh) {
            this.current = 1
            this.offset = 0
          }
          var params = Object.assign({ macId: this.macId, insuranceOrgId: this.insuranceOrgId, hospitalNo: this.hospitalNo }, this.queryObj)
          if (this.queryObj.queryDate && this.queryObj.queryDate.length > 0) {
            params.startDay = this.$moment(this.queryObj.queryDate[0]).format('YYYYMMDD')
            params.endDay = this.$moment(this.queryObj.queryDate[1]).format('YYYYMMDD')
          }
          queryHospitalSettement(params).then(res => {
            this.tableData = res.data && res.data.infos
          }).catch(err => {
            console.log('err', err)
          })
        }
      })
    }
  },
  components: {
    DetailDialog,
    personno
  },
  filters: {
    timeFormatter (val) {
      return val && val.substring(0, 8)
    }
  }
}
</script>
