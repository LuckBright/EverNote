/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-08 11:54:29
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-11 08:35:14
 * 省内异地就医费用预结算表
 */
<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">
    <search-check
      query-tips="结算属期"
      query-btn-name="统计"
      @query="getMedicalCostRefusePay"
      :querySchema="querySchema"></search-check>
    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <h2 class="alg_c">黑龙江省省直医疗保险定点医疗机构拒付（扣款）明细信息查询</h2>

        <el-table
          border
          show-summary
          :data="tableData">
          <el-table-column
            prop="outPersonTime"
            type="index"
            width="50"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="personalNo"
            label="个人编号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="visitDept"
            label="科室">
          </el-table-column>
          <el-table-column
            prop="medicareSerialNo"
            label="住院流水号">
          </el-table-column>
          <el-table-column
            prop="itemCode"
            label="收费项目编码">
          </el-table-column>
          <el-table-column
            prop="itemName"
            label="收费项目名称">
          </el-table-column>
          <el-table-column
            prop="itemChargeTpye"
            label="收费类别">
          </el-table-column>
          <el-table-column
            prop="itemType"
            label="收费项目种类">
          </el-table-column>
          <el-table-column
            prop="itemLevel"
            label="收费项目等级">
          </el-table-column>
          <el-table-column
            prop="itemPrice"
            label="单价">
          </el-table-column>
          <el-table-column
            prop="itemNumber"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="itemAmount"
            label="金额">
          </el-table-column>
          <el-table-column
            prop="personPay"
            label="自付金额">
          </el-table-column>
          <el-table-column
            prop="medicPay"
            label="医保内金额">
          </el-table-column>
          <el-table-column
            prop="realPay"
            label="审核扣款金额">
          </el-table-column>
          <el-table-column
            prop="reason"
            label="审核扣款原因">
          </el-table-column>
          <el-table-column
            prop="day"
            label="审核日期">
          </el-table-column>
        </el-table>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="请选择查询范围和结算属期"></everNoData> -->
  </el-container>
</template>

<script>
import SearchCheck from './search.check'
import { medicalCostRefusePay } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

const querySchema = [
  {
    name: 'type',
    label: '查询范围',
    comp: 'ever-select',
    props: {
      options: [
        // 禅道：27654
        { id: 1, name: '参保人员门诊' },
        // { id: 2, name: '特殊人员门诊 ' },
        { id: 3, name: '参保人员住院' },
        // { id: 4, name: '特殊人员住院' },
        // { id: 5, name: '参保人员药店' },
        // { id: 6, name: '特殊人员药店' },
      ]
    }
  },
  {
    name: 'year',
    label: '结算属期',
    comp: 'el-date-picker',
    props: {
      type: 'month'
    }
  },
]
export default {
  data () {
    return {
      querySchema,
      loading: false,
      tableData: [],
    }
  },
  computed: {
    isShow () {
      return this.tableData.length
    }
  },
  components: {
    SearchCheck
  },
  methods: {
    getMedicalCostRefusePay (year, queryObj) {
      const type = queryObj.type
      if (!type) {
        return this.everWarning('请选择查询范围')
      }
      this.loading = true
      medicalCostRefusePay({
        insuranceOrgId: hljybCode,
        macId: this.macId,
        mouth: this.$moment(queryObj.year).format('YYYYMM'),
        type
      }).then(res => {
        const { data } = res
        if (data) {
          this.tableData = data
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

