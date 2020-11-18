/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-08 11:54:29
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-09 15:46:38
 * 省内异地就医费用预结算表
 */
<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">
    <search-check
      query-tips="统计属期"
      query-btn-name="统计"
      @query="getMedicalCostMouthDifPlacesPreSettlement"
      :querySchema="querySchema"></search-check>
    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <h2 class="alg_c">黑龙江省省直医疗保险定点医疗机构异地就医费用预结算表</h2>
        <el-form ref="form" class="readform" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="定点医疗机构名称:">{{orgName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编码:">{{orgNo}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          show-summary
          border
          :data="tableData">
          <el-table-column
            prop="outPersonTime"
            label="门诊人次">
          </el-table-column>
          <el-table-column
            prop="hosPersonTime"
            label="住院人次">
          </el-table-column>
          <el-table-column
            prop="medicPay"
            label="医保基金垫付总额">
          </el-table-column>
          <el-table-column
            prop="realPay"
            label="审核扣款金额">
          </el-table-column>
          <el-table-column
            prop="shouldPay"
            label="应结算金额">
          </el-table-column>
          <el-table-column
            prop="tempPay"
            label="暂扣款金额">
          </el-table-column>
          <el-table-column
            prop="prePay"
            label="医保预结算总额">
          </el-table-column>
        </el-table>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="请选择统计属期"></everNoData> -->
  </el-container>
</template>

<script>
import SearchCheck from './search.check'
import { medicalCostMouthDifPlacesPreSettlement } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

const querySchema = [{
  name: 'year',
  label: '统计属期',
  comp: 'datePicker',
  props: {
    startPlaceholder: '开始月份',
    endPlaceholder: '结束月份',
    type: 'monthrange'
  }
},
{
  name: 'type',
  label: '统计类别',
  comp: 'ever-select',
  props: {
    options: [
      { id: '0', name: '居民' },
      { id: '1', name: '职工 ' },
      { id: '2', name: '所有' },
    ]
  }
}]
export default {
  data () {
    return {
      querySchema,
      loading: false,
      tableData: [],
      obj: {},
      queryType: ''
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
  components: {
    SearchCheck
  },
  methods: {
    getMedicalCostMouthDifPlacesPreSettlement (year, queryObj) {
      const type = queryObj.type
      if (!type) {
        return this.everWarning('请选择统计类别')
      }
      this.loading = true
      medicalCostMouthDifPlacesPreSettlement({
        insuranceOrgId: hljybCode,
        macId: this.macId,
        startMouth: this.$moment(queryObj.year[0]).format('YYYYMM'),
        endMouth: this.$moment(queryObj.year[1]).format('YYYYMM'),
        type
      }).then(res => {
        const { data } = res
        if (data) {
          this.tableData = data
          this.obj = data
        }
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import url('./index.scss');
</style>

