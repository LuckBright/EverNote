/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-08 11:53:55
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-11 08:37:32
 * 医疗费用年度汇总表
 */
<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">
    <search-check @query="getMedicalCostYearReport"></search-check>
    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <h2 class="alg_c">黑龙江省省直医疗保险定点医疗费用申请表（{{year}}年度）</h2>
        <el-form ref="form" class="readform" label-position="left">
          <el-row>
            <el-col :span="8">
              <el-form-item label="填报单位（公章）:">{{obj.hospitalName}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="基本医疗保险普通门诊总人次:">{{obj.outpatientPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="基本医疗保险普通住院患者人均住院定额:">{{obj.hospitalAmount}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="编码:">{{obj.hospitalNo}}</el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="基本医疗保险门诊特殊治疗结算总人次:">{{obj.outpatientRenalPersonTime}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="银行账号:">{{obj.bankAccount}}</el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="特殊人群门诊总人次:">{{obj.spicalOutpatientPersonTime}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="开户银行:">{{obj.bankName}}</el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="基本医疗保险普通住院出院结算总人次:">{{obj.hosPersonTime}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="申报年份:">{{obj.statYear}}</el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="生育人次合计:">{{obj.birthPersonTime}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <!-- 表格部分 -->
        <el-table
          show-summary
          border
          :data="tableData">
          <el-table-column
            prop="month"
            label="月份"
            width="50">
          </el-table-column>
          <el-table-column
            align="center"
            label="基本医疗保险各项基金申报金额">
            <el-table-column
              label="基本医疗保险费支出"
              align="center">
              <el-table-column
                label="统筹基金"
                align="center">
                <el-table-column
                  label="门诊"
                  prop="normalOutAmount"
                  align="left">
                </el-table-column>
                <el-table-column
                  label="住院"
                  prop="hospitalAmount"
                  align="left">
                </el-table-column>
                <el-table-column
                  label="小计"
                  prop="medicalBaisc"
                  align="left">
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="个人账户"
                align="center">
                <el-table-column
                  label="门诊"
                  prop="medicPerson"
                  align="left">
                </el-table-column>
                <el-table-column
                  label="住院"
                  prop="medicPersonHos"
                  align="left">
                </el-table-column>
                <el-table-column
                  label="小计"
                  prop="medicPersonTotal"
                  align="left">
                </el-table-column>
              </el-table-column>
              <el-table-column
                label="合计"
                prop="medicBasicTotal"
                align="center">
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="大额医疗补助"
              prop="medicLargeTotal"
              align="center">
            </el-table-column>
            <el-table-column
              label="公务员医疗补助"
              align="center">
              <el-table-column
                label="门诊"
                prop="medicCivilOut"
                align="left">
              </el-table-column>
              <el-table-column
                label="住院"
                prop="medicCivilHos"
                align="left">
              </el-table-column>
              <el-table-column
                label="小计"
                prop="medicCivilTotal"
                align="left">
              </el-table-column>
            </el-table-column>
            <el-table-column
              label="合计"
              prop="medicTotal"
              align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            label="特殊人员基金申报额">
            <el-table-column
              label="离退休老红军个人账户"
              prop="retPerson"
              align="center">
            </el-table-column>
            <el-table-column
              label="伤残军人个人账户"
              prop="armyPerson"
              align="center">
            </el-table-column>
            <el-table-column
              label="合计"
              prop="spicalPerson"
              align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column
            align="center"
            prop="total"
            label="合计">
          </el-table-column>
        </el-table>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="请选择统计年度"></everNoData> -->
  </el-container>
</template>

<script>
import { medicalCostYearReport } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import SearchCheck from './search.check'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { enumMonth } from '../../enum/index'

export default {
  data () {
    return {
      loading: false,
      tableData: [],
      obj: {},
      year: ''
    }
  },
  components: {
    SearchCheck
  },
  computed: {
    isShow () {
      return Object.keys(this.obj).length
    }
  },
  methods: {
    getMedicalCostYearReport (year) {
      this.loading = true
      medicalCostYearReport({
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
        normalOutAmount: data[`normalOutAmount${item}`], // 基本医疗保险门诊统筹基金支出
        hospitalAmount: data[`hospitalAmount${item}`], // 基本医疗保险住院统筹基金支出
        medicalBaisc: data[`medicalBaisc${item}`], // 基本医疗保险统筹基金支出小计
        medicPerson: data[`medicPerson${item}`], // 基本医疗保险门诊个人账户支出
        medicPersonHos: data[`medicPersonHos${item}`], // 基本医疗保险普通住院个人账户支出
        medicPersonTotal: data[`medicPersonTotal${item}`], // 基本医疗保险个人账户支出小计
        medicBasicTotal: data[`medicBasicTotal${item}`], // 基本医疗保险统筹基金和个人账户支出合计
        medicLargeTotal: data[`medicLargeTotal${item}`], // 基本医疗保险大额医疗补助支出
        medicCivilOut: data[`medicCivilOut${item}`], // 基本医疗保险门诊公务员补助支出
        medicCivilHos: data[`medicCivilHos${item}`], // 基本医疗保险住院公务员补助支出
        medicCivilTotal: data[`medicCivilTotal${item}`], // 基本医疗保险公务员补助支出小计
        medicTotal: data[`medicTotal${item}`], // 基本医疗保险医保基金支出合计
        retPerson: data[`retPerson${item}`], // 离休老红军个人账户支出
        armyPerson: data[`armyPerson${item}`], // 伤残军人个人账户支出
        spicalPerson: data[`spicalPerson${item}`], // 特殊人员基金支出合计
        total: data[`total${item}`], // 申报额总计
      }))
    }
  }
}

</script>
<style lang="scss" scoped>
  @import url('./index.scss');
</style>
