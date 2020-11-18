<template>
  <el-container v-loading="loading" class="layout_box table-main flex_column_full_hidden">
    <search-check
      query-btn-name="申报"
      query-tips="申报属期"
      @query="medicalFeeDecalaration"
      :querySchema="querySchema"
    ></search-check>
    <el-container class="page_layout_full_hidden">
      <div class="flex_layout_scroll">
        <h2 class="alg_c">黑龙江省省直医疗保险定点医疗机构医疗费用申报表</h2>
        <el-form ref="form" class="readform" label-position="left">
          <el-row>
            <el-col :span="6">
              <el-form-item label="统计时间:">{{result.statTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="统计月份:">{{result.mouth}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总额控制标志:">{{result.controlTotal?'是':'否'}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="填报单位:">{{result.hospitalName}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="特殊人群门诊人次:">{{result.spicalOutpatientPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="离休老红军个人账户:">{{result.retPersonAccount | formatToFinacial}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="基本医疗医保垫付:">{{result.medicalPay | formatToFinacial}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="编码:">{{result.hospitalNo}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="普通住院人次:">{{result.hosPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="伤残军人个人账户:">{{result.armyPersonAccount | formatToFinacial}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="门诊特殊人员个人现金:">{{result.outSpicalPersonCash | formatToFinacial}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="银行账号:">{{result.bankAccount}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生育人次:">{{result.birthPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="门诊基本医疗个人现金:">{{result.outPersonCash | formatToFinacial}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="住院特殊人员个人现金:">{{result.hosSpicalPersonCash | formatToFinacial}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="开户银行:">{{result.bankName}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生育正常产人次:">{{result.birthNormalPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="住院基本医疗个人现金:">{{result.hosPersonCash | formatToFinacial}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="特殊人员医保垫付:">{{result.spicalMedicalPay | formatToFinacial}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="普通门诊人次:">{{result.outpatientPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生育侧切人次:">{{result.birthLatPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="普通住院统筹基金人均住院定额:">{{result.hosCost | formatToFinacial}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="门诊肾透析人次:">{{result.outpatientRenalPersonTime}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="生育剖腹产人次:">{{result.birthLapPersonTime}}</el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="特殊疾病人次:">{{result.spicalDiseasePersonTime}}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col
            :span="6"
            class="el-table el-table--fit el-table--border el-table--group el-table--enable-row-hover"
          >
            <table class="myTable el-table__header" align="center">
              <tr>
                <th class="myTh" colspan="3">医疗费支付情况</th>
              </tr>
              <tr>
                <td rowspan="6">各项基金申报金额</td>
                <td rowspan="3">基本医疗保险基金</td>
                <td class="myTd">个人账户</td>
              </tr>
              <tr>
                <td class="myTd">统筹基金</td>
              </tr>
              <tr>
                <td class="myTd">小计</td>
              </tr>
              <tr>
                <td class="myTd" colspan="2">大额医疗费用补助</td>
              </tr>
              <tr>
                <td class="myTd" colspan="2">公务员医疗补助</td>
              </tr>
              <tr>
                <td class="myTd" colspan="2">合计</td>
              </tr>
            </table>
          </el-col>
          <el-col :span="16">
            <el-table border :data="tableData" height="241">
              <el-table-column label="门诊" align="center">
                <el-table-column label="普通门诊" prop="ptmz" align="right" header-align="center">
                  <template slot-scope="scope">{{scope.row.ptmz|formatToFinacial}}</template>
                </el-table-column>
                <el-table-column label="特殊门诊" prop="tsmz" align="right" header-align="center">
                  <template slot-scope="scope">{{scope.row.tsmz|formatToFinacial}}</template>
                </el-table-column>
                <el-table-column label="小计" prop="mzSum" align="right" header-align="center">
                  <template slot-scope="scope">{{scope.row.mzSum|formatToFinacial}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column label="住院" align="center">
                <el-table-column label="普通住院" prop="ptzy" align="right" header-align="center">
                  <template slot-scope="scope">{{scope.row.ptzy|formatToFinacial}}</template>
                </el-table-column>
                <el-table-column label="生育住院" prop="syzy" align="right" header-align="center">
                  <template slot-scope="scope">{{scope.row.syzy|formatToFinacial}}</template>
                </el-table-column>
                <el-table-column label="小计" prop="zySum" align="right" header-align="center">
                  <template slot-scope="scope">{{scope.row.zySum|formatToFinacial}}</template>
                </el-table-column>
              </el-table-column>
              <el-table-column prop="tsjb" label="特殊疾病" align="right" header-align="center">
                <template slot-scope="scope">{{scope.row.tsjb|formatToFinacial}}</template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-container>
    <!-- <everNoData v-else tipTxt="请选择查询范围和结算属期"></everNoData> -->
  </el-container>
</template>

<script>
import SearchCheck from './search.check'
import { medicalFeeDecalaration } from '@/rcm/store/otmdiscomponent/hlj-api.js'
import { hljybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

const querySchema = [
  {
    name: 'year',
    label: '申报属期',
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
      result: {},
      tableData: [],
    }
  },
  components: {
    SearchCheck
  },
  methods: {
    getSum (flag) {
      if (flag) {
        return (this.ptmz || 0) + (this.tsmz || 0)
      } else {
        return (this.ptzy || 0) + (this.syzy || 0)
      }
    },
    medicalFeeDecalaration (year, queryObj) {
      this.loading = true
      medicalFeeDecalaration({
        insuranceOrgId: hljybCode,
        macId: this.macId,
        mouth: this.$moment(queryObj.year).format('YYYYMM'),
      }).then(res => {
        const { data } = res
        if (data) {
          // 处理table中各层数据
          // 个人账户
          this.tableData = []
          let personalAccount = {
            ptmz: data.personAccount,
            tsmz: data.renalPersonAccount,
            ptzy: data.hospitalPersonAccount,
            syzy: data.bitrhPersonAccount,
            tsjb: data.spicalDiseasePersonAccount,
          }
          // 统筹基金
          let overAllFund = {
            ptmz: data.normalOutAmount,
            tsmz: data.spicalOutAmount,
            ptzy: data.hospitalAmount,
            syzy: data.hospitalBiirthAmount,
            tsjb: data.spicalDiseaseMedical,
          }
          // 个人账户+统筹基金
          let littleSum = {}
          Object.keys(personalAccount).map(key => {
            littleSum[key] = (personalAccount[key] || 0) + (overAllFund[key] || 0)
          })
          // 大额医疗费用补助
          let bigExpenseSub = {
            ptmz: data.normalOutLargeAmount,
            tsmz: data.spicalOutLargeAmount,
            ptzy: data.normalHosLargeAmount,
            syzy: data.birthHosLargeAmount,
            tsjb: data.spicalDiseaseLargeAmount,
          }
          // 公务员医疗补助
          let civilServeSub = {
            ptmz: data.normalOutCivilAmount,
            tsmz: data.spicalOutCivilAmount,
            ptzy: data.normalHosCivilAmount,
            syzy: data.birthHosCivilAmount,
            tsjb: data.spicalDiseaseAmount,
          }
          let totalSum = {}
          Object.keys(personalAccount).map(key => {
            totalSum[key] = (personalAccount[key] || 0) + (overAllFund[key] || 0) + (bigExpenseSub[key] || 0) + (civilServeSub[key] || 0)
          })
          this.tableData.push(personalAccount, overAllFund, littleSum, bigExpenseSub, civilServeSub, totalSum)
          this.tableData.forEach(item => {
            item.mzSum = (item.ptmz || 0) + (item.tsmz || 0)
            item.zySum = (item.ptzy || 0) + (item.syzy || 0)
          })
          this.result = data
        }
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import url("./index.scss");
.myTable {
  width: 100%;
  border: 1 solid #000;
  border-collapse: collapse;
  th,
  td {
    text-align: center;
  }
  .myTh {
    height: 59px;
  }
  .myTd {
    height: 30px;
  }
}
</style>

