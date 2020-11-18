/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-08 11:54:29
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-09 15:49:16
 * 省内异地就医费用月申报表
 */
<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">
    <search-check
      query-tips="统计属期"
      query-btn-name="统计"
      @query="getMedicalCostMouthDifPlaces"
      :querySchema="querySchema"></search-check>
    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <h2 class="alg_c">黑龙江省省直医疗保险定点医疗机构异地就医费用月申报表</h2>
        <el-form ref="form" class="readform" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="定点医疗机构名称:"></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编码:"> </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-table
          border
          show-summary
          :data="tableData">
          <el-table-column
            prop="mouth"
            label="属期">
          </el-table-column>
          <el-table-column
            prop="outpatient"
            label="省内门诊">
          </el-table-column>
          <el-table-column
            prop="outpatientOtherProvince"
            label="跨省门诊">
          </el-table-column>
          <el-table-column
            prop="outpatientTotal"
            label="门诊合计">
          </el-table-column>
          <el-table-column
            prop="hospital"
            label="省内住院">
          </el-table-column>
          <el-table-column
            prop="hospitalOtherProvince"
            label="跨省住院">
          </el-table-column>
          <el-table-column
            prop="hospitalTotal"
            label="住院合计">
          </el-table-column>
        </el-table>
        <el-form ref="form" class="readform" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="机构负责人:"> </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报表人:"></el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <p class="f14">此表无单位公章（或财务章）和医疗机构负责人签字无效，表中所填内容必须真实、完整、准确。</p>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="统计属期"></everNoData> -->
  </el-container>
</template>

<script>
import SearchCheck from './search.check'
import { medicalCostMouthDifPlaces } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { statisticsType } from '../../enum/index'
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
    options: statisticsType
  }
}]
export default {
  data () {
    return {
      querySchema,
      loading: false,
      obj: {},
      tableData: [],
    }
  },
  computed: {
    isShow () {
      return Object.keys(this.obj).length
    }
  },
  components: {
    SearchCheck
  },
  methods: {
    getMedicalCostMouthDifPlaces (year, queryObj) {
      this.loading = true
      const type = queryObj.type
      medicalCostMouthDifPlaces({
        insuranceOrgId: hljybCode,
        macId: this.macId,
        version: 'v000000002',
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

