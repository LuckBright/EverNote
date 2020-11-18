/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-07 18:05:11
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-09 16:45:15
 * 医保年度结算对账表
 */
<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">
    <search-check @query="getMedicalCostYear"></search-check>
    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <h2 class="alg_c">黑龙江省省直医疗保险定点医疗机构结算对账表（{{year}}年度）</h2>
        <el-form ref="form" class="readform" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="定点医疗机构名称:">{{obj.hospitalName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="黑龙江省医保局（公章）:"></el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="编码:">{{obj.hospitalNo}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报表打印时间:">{{serachTime}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <h3>表1 月结对账单</h3>
        <el-table
          border
          show-summary
          :data="tableData">
          <el-table-column
            prop="month"
            label="月份"
            width="50">
          </el-table-column>
          <el-table-column align="center" label="基本医疗保险（含公务员医疗补助和大额医疗费用补助保险）">
            <el-table-column
              prop="medical"
              label="申报额">
            </el-table-column>
            <el-table-column label="审核不合理金额"
              prop="medicalUnreasonable">
            </el-table-column>
            <el-table-column label="当月超指标金额"
              prop="medicalExceed">
            </el-table-column>
            <el-table-column label="应结算额"
              prop="medicalShould">
            </el-table-column>
            <el-table-column label="10%暂扣款"
              prop="medicalCusPer">
            </el-table-column>
            <el-table-column label="当月结算额"
              prop="medicalSettlement">
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="特殊人员">
            <el-table-column
              prop="medicalSpical"
              label="申报额">
            </el-table-column>
            <el-table-column label="审核不合理金额"
              prop="medicalSpicalUnreasonable">
            </el-table-column>
            <el-table-column label="应结算额"
              prop="medicalSpicalShould">
            </el-table-column>
            <el-table-column label="10%暂扣款"
              prop="medicalSpicalPer">
            </el-table-column>
            <el-table-column label="当月结算额"
              prop="medicalSpicalSettlement">
            </el-table-column>
          </el-table-column>
        </el-table>
        <h3>表2 年度对账单</h3>
        <el-table border :data="tableData.length ? [obj] : []">
          <el-table-column align="center" label="基本医疗">
            <el-table-column label="年终考核后结算金额"
              prop="settlementAmount">
            </el-table-column>
            <el-table-column label="年终平衡补差"
              prop="medicalDiff">
            </el-table-column>
            <el-table-column label="审核不合理年终调整"
              prop="medicalAdj">
            </el-table-column>
            <el-table-column label="年终付款合计"
              prop="medicalTotalAmount">
            </el-table-column>
            <el-table-column label="年终10%考核扣款"
              prop="medicalPer">
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="特殊人员个人账户">
            <el-table-column label="年终考核后结算金额"
              prop="spicalSettlementAmount">
            </el-table-column>
            <el-table-column label="审核不合理年终调整"
              prop="spicalMedicalAdj">
            </el-table-column>
            <el-table-column label="年终付款合计"
              prop="spicalMedicalTotalAmount">
            </el-table-column>
            <el-table-column label="年终10%考核扣款"
              prop="spicalMedicalPer">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="请选择统计年度"></everNoData> -->
  </el-container>
</template>

<script>
import { medicalCostYear } from '@/rcm/store/otmdiscomponent/hlj-api.js'
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
    }
  },
  methods: {
    getMedicalCostYear (year) {
      this.loading = true
      medicalCostYear({
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
        medical: data[`medical${item}`],
        medicalUnreasonable: data[`medical${item}Unreasonable`],
        medicalExceed: data[`medical${item}Exceed`],
        medicalShould: data[`medical${item}Should`],
        medicalCusPer: data[`medical${item}Per`],
        medicalSettlement: data[`medical${item}Settlement`],
        medicalSpical: data[`medical${item}Spical`],
        medicalSpicalUnreasonable: data[`medical${item}SpicalUnreasonable`],
        medicalSpicalShould: data[`medical${item}SpicalShould`],
        medicalSpicalPer: data[`medical${item}SpicalPer`],
        medicalSpicalSettlement: data[`medical${item}SpicalSettlement`]
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
  @import url('./index.scss');
</style>
