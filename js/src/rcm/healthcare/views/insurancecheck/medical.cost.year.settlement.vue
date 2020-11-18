/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-07 18:05:11
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-09 15:47:22
 * 省内异地就医费用年结算对账表（年度）
 */
<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">
    <search-check @query="getMedicalCostMouthDifPlacesSettlement"></search-check>
    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <h2 class="alg_c">黑龙江省省直医疗保险定点医疗机构结算对账表（{{year}}年度）</h2>
        <el-form ref="form" class="readform" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="定点医疗机构名称:">{{orgName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="黑龙江省医保局（公章）:"></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="编码:">{{orgNo}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报表打印时间:">{{serachTime}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <h3>表1 月结对账单</h3>
        <el-table
          show-summary
          border
          :data="tableData">
          <el-table-column
            prop="month"
            label="月份"
            width="50">
          </el-table-column>
          <el-table-column align="center" label="职工">
            <el-table-column
              prop="reportAmount"
              label="申报额">
            </el-table-column>
            <el-table-column label="审核不合理金额"
              prop="workersUnreasonable">
            </el-table-column>
            <el-table-column label="当月超指标金额"
              prop="workersExceeed">
            </el-table-column>
            <el-table-column label="应结算额"
              prop="workersShould">
            </el-table-column>
            <el-table-column label="5%暂扣款"
              prop="workersPerc">
            </el-table-column>
            <el-table-column label="当月95%实结"
              prop="workersPercPay">
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="居民">
            <el-table-column
              prop="residentReportAmount"
              label="申报额">
            </el-table-column>
            <el-table-column label="审核不合理金额"
              prop="residentUnreasonable">
            </el-table-column>
            <el-table-column label="当月超指标金额"
              prop="residentExceeed">
            </el-table-column>
            <el-table-column label="应结算额"
              prop="residentShould">
            </el-table-column>
            <el-table-column label="5%暂扣款"
              prop="residentPerc">
            </el-table-column>
            <el-table-column label="当月95%实结"
              prop="residentPercPay">
            </el-table-column>
          </el-table-column>
        </el-table>
        <h3>表2 年度对账单</h3>
        <el-table :data="tableData.length ? [obj] : []" border>
          <el-table-column align="center" label="职工">
            <el-table-column label="5%考核后结算金额"
              prop="workersPercTotal">
            </el-table-column>
            <el-table-column label="指标年终平衡补差"
              prop="workersBalance">
            </el-table-column>
            <el-table-column label="审核不合理年终调整"
              prop="workersUnreasonableAdj">
            </el-table-column>
            <el-table-column label="年终付款合计"
              prop="workersPayTotal">
            </el-table-column>
            <el-table-column label="年终5%考核扣款"
              prop="workersPercPayTotal">
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="居民">
            <el-table-column label="5%考核后结算金额"
              prop="residentPercTotal">
            </el-table-column>
            <el-table-column label="指标年终平衡补差"
              prop="residentBalance">
            </el-table-column>
            <el-table-column label="审核不合理年终调整"
              prop="residentUnreasonableAdj">
            </el-table-column>
            <el-table-column label="年终付款合计"
              prop="residentPayTotal">
            </el-table-column>
            <el-table-column label="年终5%考核扣款"
              prop="residentPercPayTotal">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="请选择统计年度"></everNoData> -->
  </el-container>
</template>

<script>
import { medicalCostMouthDifPlacesSettlement } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import SearchCheck from './search.check'
import { enumMonth } from '../../enum/index'

export default {
  components: { SearchCheck },
  data () {
    return {
      loading: false,
      obj: {},
      serachTime: '',
      tableData: [],
      year: ''
    }
  },
  computed: {
    isShow () {
      return Object.keys(this.obj).length
    },
    orgName () {
      return this.obj.orgName
    },
    orgNo () {
      return this.obj.orgNo
    }
  },
  methods: {
    getMedicalCostMouthDifPlacesSettlement (year) {
      this.loading = true
      medicalCostMouthDifPlacesSettlement({
        year,
        insuranceOrgId: hljybCode,
        macId: this.macId
      }).then(res => {
        const { data } = res
        if (data) {
          this.tableData = this.composeData(data)
          this.obj = data
        }
        this.year = year
        this.serachTime = this.$moment().format('YYYY-MM-DD')
      }).finally(_ => {
        this.loading = false
      })
    },
    /**
     * 拆分数据为日期格式
    */
    composeData (data) {
      return enumMonth.map((item, index) => ({
        month: index + 1,
        reportAmount: data[`reportAmount${item}`], // 申报额(职工)
        workersUnreasonable: data[`workersUnreasonable${item}`], // 审核不合理金额(职工)
        workersExceeed: data[`workersExceeed${item}`], // 当月超指标金额(职工)
        workersShould: data[`workersShould${item}`], // 应结算额(职工)
        workersPerc: data[`workersPerc${item}`], // 5%暂扣款(职工)
        workersPercPay: data[`workersPercPay${item}`], // 当月95%实结(职工)
        residentReportAmount: data[`residentReportAmount${item}`], // 申报额(居民)
        residentUnreasonable: data[`residentUnreasonable${item}`], // 审核不合理金额(居民)
        residentExceeed: data[`residentExceeed${item}`], // 当月超指标金额(居民)
        residentShould: data[`residentShould${item}`], // 应结算额(居民)
        residentPerc: data[`residentPerc${item}`], // 5%暂扣款(居民)
        residentPercPay: data[`residentPercPay${item}`], // 当月95%实结(居民)
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import url('./index.scss');
</style>
