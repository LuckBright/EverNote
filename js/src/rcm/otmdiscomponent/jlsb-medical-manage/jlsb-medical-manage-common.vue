<template>
  <div class="layout_inner">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" :span="6" @query="list(true)">
      <template slot="insuranceOrgId">
        <medicalOrgList v-model="queryObj.insuranceOrgId" @change="medicalOrgChange"></medicalOrgList>
      </template>
      <template slot="btns">
        <div class="btns">
          <el-button @click="list(true)" type="primary" size="small">查询</el-button>
          <el-button @click="resetForm" size="small">重置</el-button>
          <slot name="extendButtons"></slot>
        </div>
      </template>
      <div></div>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table
        :data="tableData"
        border
        stripe
        row-key="id"
        :expand-row-keys="firstExpandRows"
        class="medicalTable"
        @expand-change="handleExpandClick"
        v-loading="loading"
      >
        <el-table-column prop type="expand">
          <template slot-scope="scope">
            <!-- 第二层 -->
            <el-table
              border
              stripe
              row-key="id"
              :expand-row-keys="scope.row.expandedRows"
              :data="scope.row.children"
              empty-text="暂无数据"
              @expand-change="handleExpandClickInner"
              v-loading="scope.row.loading"
            >
              <el-table-column type="expand" fixed="left">
                <template slot-scope="scope">
                  <!-- 第三层 -->
                  <el-table
                    :data="scope.row.children"
                    border
                    stripe
                    empty-text="暂无数据"
                    v-loading="scope.row.loading"
                    @selection-change="handleSelection"
                  >
                    <el-table-column type="selection" fixed="left"></el-table-column>
                    <el-table-column label="交易时间" prop="createTime">
                      <template
                        slot-scope="scope"
                      >{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
                    </el-table-column>
                    <el-table-column label="处方号" prop="recipeNo"></el-table-column>
                    <el-table-column label="交易类型" prop="tradeType">
                      <template slot-scope="scope">{{scope.row.tradeType | uploadTradeType}}</template>
                    </el-table-column>
                    <el-table-column label="医院项目编码" prop="hisCode"></el-table-column>
                    <el-table-column label="医院项目名称" prop="hisName"></el-table-column>
                    <el-table-column label="数量" prop="count"></el-table-column>
                    <el-table-column label="单价" prop="unitprice">
                      <template slot-scope="scope">{{scope.row.unitprice | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="单位" prop="unit"></el-table-column>
                    <el-table-column label="规格" prop="specification"></el-table-column>
                    <el-table-column label="收费项目等级" prop="chargeLevel">
                      <template slot-scope="scope">{{scope.row.chargeLevel | medicalChargeLevel}}</template>
                    </el-table-column>
                    <el-table-column label="金额" prop="feeAll">
                      <template slot-scope="scope">{{scope.row.feeAll | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="自理金额" prop="ziliFee">
                      <template slot-scope="scope">{{scope.row.ziliFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="自费金额" prop="selfpay">
                      <template slot-scope="scope">{{scope.row.selfpay | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="超限价自付金额" prop="exceedFee">
                      <template slot-scope="scope">{{scope.row.exceedFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="医院负担金额" prop="hosFee">
                      <template slot-scope="scope">{{scope.row.hosFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status">
                      <template slot-scope="scope">{{scope.row.status | uploadStatus}}</template>
                    </el-table-column>
                    <el-table-column label="中心流水号" prop="centerTradeNo" width="200"></el-table-column>
                    <el-table-column label="经办人" prop="managerName"></el-table-column>
                    <el-table-column label="操作" width="240px" fixed="right">
                      <template slot-scope="scope">
                        <slot name="thirdLayerRow" :thirdLayerRow="scope.row"></slot>
                      </template>
                    </el-table-column>
                  </el-table>
                  <ever-pagination
                    style="margin-right:220px;"
                    :current="scope.row.pageParams.current"
                    :pagesize="scope.row.pageParams.pagesize"
                    :page-sizes="scope.row.pageParams.pageSizes"
                    @size-change="handleSizeChange_inner($event,scope.row)"
                    @current-change="handleCurrentChange_inner($event,scope.row)"
                    :totalCount="scope.row.pageParams.totalCount"
                  ></ever-pagination>
                </template>
              </el-table-column>
              <el-table-column label="结算单号" show-overflow-tooltip prop="settlementCode"></el-table-column>
              <el-table-column label="交易类型" prop="tradeType">
                <template slot-scope="scope">{{scope.row.tradeType | jlsbTradeType}}</template>
              </el-table-column>
              <el-table-column label="结算状态" prop="settleStatus">
                <template slot-scope="scope">{{scope.row.settleStatus | settleStatus}}</template>
              </el-table-column>
              <el-table-column label="医疗费总额" prop="totalFee">
                <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="自费金额" prop="selfpay">
                <template slot-scope="scope">{{scope.row.selfpay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本次帐户支付" prop="personcountpay">
                <template slot-scope="scope">{{scope.row.personcountpay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹支出" prop="overallPay">
                <template slot-scope="scope">{{scope.row.overallPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="救助金支付金额" prop="salvageFundPay">
                <template slot-scope="scope">{{scope.row.salvageFundPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员补助支付金额" prop="functionarySubsidyPay">
                <template slot-scope="scope">{{scope.row.functionarySubsidyPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="现金支付金额" prop="cash">
                <template slot-scope="scope">{{scope.row.cash | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="乙类自理费用" prop="classBzili">
                <template slot-scope="scope">{{scope.row.classBzili | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="甲乙类费用" prop="classAbFee">
                <template slot-scope="scope">{{scope.row.classAbFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="符合基本医疗费用" prop="basicMedicalFee">
                <template slot-scope="scope">{{scope.row.basicMedicalFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="起付标准自付" prop="standardSelfPay">
                <template slot-scope="scope">{{scope.row.standardSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="进入统筹费用" prop="overallFee">
                <template slot-scope="scope">{{scope.row.overallFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹分段自付" prop="overallSelfPay">
                <template slot-scope="scope">{{scope.row.overallSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="进入大额段费用" prop="largeAmountFee">
                <template slot-scope="scope">{{scope.row.largeAmountFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="大额段个人支付" prop="largeAmountSelfPay">
                <template slot-scope="scope">{{scope.row.largeAmountSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="超封顶线个人自付金额" prop="exceedSelfPay">
                <template slot-scope="scope">{{scope.row.exceedSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="保健对象支付" prop="healthcarePay">
                <template slot-scope="scope">{{scope.row.healthcarePay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员门诊可补助费用" prop="functionarySubsidyFee">
                <template slot-scope="scope">{{scope.row.functionarySubsidyFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹段乙类自理费用" prop="overallClassBFee">
                <template slot-scope="scope">{{scope.row.overallClassBFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹段公务员补助支付" prop="overallFunctionarySubsidyPay">
                <template
                  slot-scope="scope"
                >{{scope.row.overallFunctionarySubsidyPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="进入公补段费用" prop="gbFee">
                <template slot-scope="scope">{{scope.row.gbFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补段乙类自理费用" prop="gbClassBFee">
                <template slot-scope="scope">{{scope.row.gbClassBFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补段基金支付金额" prop="gbFundFee">
                <template slot-scope="scope">{{scope.row.gbFundFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补段个人支付金额" prop="gbSelfPay">
                <template slot-scope="scope">{{scope.row.gbSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="大额段乙类自理费用" prop="lmzlFee">
                <template slot-scope="scope">{{scope.row.lmzlFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="新生儿费用" prop="babyFee">
                <template slot-scope="scope">{{scope.row.babyFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补支乙类自理" prop="gbClassBSelfPay">
                <template slot-scope="scope">{{scope.row.gbClassBSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公补支统筹分段自付" prop="gbOverallSelfPay">
                <template slot-scope="scope">{{scope.row.gbOverallSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员门诊第一段补助金额" prop="functionaryFisrtSubsidyFee">
                <template
                  slot-scope="scope"
                >{{scope.row.functionaryFisrtSubsidyFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员门诊第二段补助金额" prop="functionarySecondSubsidyFee">
                <template
                  slot-scope="scope"
                >{{scope.row.functionarySecondSubsidyFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员门诊第三段补助金额" prop="functionaryThirdSubsidyFee">
                <template
                  slot-scope="scope"
                >{{scope.row.functionaryThirdSubsidyFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="就诊后帐户余额" prop="balance" width="120">
                <template slot-scope="scope">{{scope.row.balance | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="生育围产补贴" prop="birthSubsidy">
                <template slot-scope="scope">{{scope.row.birthSubsidy | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="体检补贴" prop="peSubsidy">
                <template slot-scope="scope">{{scope.row.peSubsidy | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="医院承担金额" prop="hosFee">
                <template slot-scope="scope">{{scope.row.hosFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="补充医疗支付金额" prop="supMedicalFee">
                <template slot-scope="scope">{{scope.row.supMedicalFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="差额" prop="difMoney">
                <template slot-scope="scope">{{scope.row.difMoney | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="创建人" prop="creator" width="90" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" width="160">
                <template
                  slot-scope="scope"
                >{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
              </el-table-column>
              <el-table-column label="更新人" prop="updator" width="90" show-overflow-tooltip></el-table-column>
              <el-table-column label="更新时间" prop="updateTime" width="160">
                <template
                  slot-scope="scope"
                >{{$moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
              </el-table-column>
              <el-table-column label="操作" width="240" fixed="right">
                <template slot-scope="scope">
                  <slot name="innerOperations" :innerRow="scope.row"></slot>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="treatType" label="医疗类别" width="80">
          <template slot-scope="scope">{{scope.row.treatType | treatType}}</template>
        </el-table-column>
        <el-table-column prop="doctorType" label="人员类别" show-overflow-tooltip width="80">
          <template slot-scope="scope">{{scope.row.doctorType | personType}}</template>
        </el-table-column>
        <el-table-column prop="visitNumber" label="住院号" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="personName" width="90" show-overflow-tooltip label="患者名称"></el-table-column>
        <el-table-column prop="cardno" label="卡号" width="100"></el-table-column>
        <el-table-column prop="insuranceOrgName" show-overflow-tooltip label="保险机构"></el-table-column>
        <el-table-column prop="insuranceProductName" show-overflow-tooltip label="保险产品"></el-table-column>
        <el-table-column prop="sectionName" label="科室名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drName" width="90" show-overflow-tooltip label="医生姓名"></el-table-column>
        <el-table-column prop="managerDate" label="挂号日期" width="90">
          <template slot-scope="scope">{{(scope.row.managerDate||'').substring(0,8)}}</template>
        </el-table-column>
        <!-- <el-table-column prop="hospitalizedStartDate" label="入院日期" width="90">
          <template slot-scope="scope">{{(scope.row.hospitalizedStartDate||'').substring(0,8)}}</template>
        </el-table-column>
        <el-table-column prop="hospitalizedEndDate" label="出院日期" width="90">
          <template slot-scope="scope">{{(scope.row.hospitalizedEndDate||'').substring(0,8)}}</template>
        </el-table-column>-->
        <el-table-column prop="inDiagnosisName" label="诊断疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hisDiagnosisName" label="医院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="macId" label="网卡地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tradeType" label="交易类型" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.tradeType | tradeType}}</template>
        </el-table-column>
        <el-table-column prop="operatorName" width="90" show-overflow-tooltip label="操作员"></el-table-column>
        <el-table-column prop="outprop7" label="操作" width="240">
          <template slot-scope="scope">
            <slot name="outOperations" :outRow="scope.row"></slot>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import medicalOrgList from '@/rcm/otmdiscomponent/medicalorgselect.vue'
import { treatType, settleStatus, tradeType, uploadStatus, uploadTradeType, medicalChargeLevel } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { jlsbTradeType, itemType, itemClass, personType } from '@/rcm/otmdiscomponent/config-js/jlssb-regInfo-config.js'
import { jlssbCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import list from '@/util/list'
let schema = [{
  label: '医保中心',
  name: 'insuranceOrgId',
  comp: 'custom'
},
{
  label: '患者名称',
  name: 'personName',
  comp: 'ever-patient-select',
  props: {
    useText: true
  }
},
{
  label: '住院号',
  name: 'visitNumber'
},
{
  label: '科室',
  name: 'sectionname',
  comp: 'everSubjectSelect',
  props: {
    type: 'select',
    fileds: ['id']
  }
},
{
  label: '挂号时间',
  name: 'managerDate',
  comp: 'everRangePicker',
  props: {
    defaultTime: [],
    outformat: 'YYYY-MM-DD HH:mm:ss',
    autoWidth: true
  }
},
// {
//   label: '入院时间',
//   name: 'inHospitalDate',
//   comp: 'everRangePicker',
//   span: 6,
//   props: {
//     defaultTime: [],
//     outformat: 'YYYY-MM-DD HH:mm:ss',
//     autoWidth: true
//   }
// },
// {
//   label: '出院时间',
//   name: 'outHospitalDate',
//   comp: 'everRangePicker',
//   span: 6,
//   props: {
//     defaultTime: [],
//     outformat: 'YYYY-MM-DD HH:mm:ss',
//     autoWidth: true
//   }
// },
{
  label: '',
  labelWidth: '0',
  name: 'btns',
  comp: 'custom',
  col: {
    style: 'text-align:right;'
  },
  span: 24
}]
export default {
  mixins: [list],
  props: {
    api: {
      type: [Object],
      default: _ => { }
    },
    afterList: {
      type: [Function],
      default: _ => { }
    },
    // 第二层默认展开的数据,第三层的在第二层的row.expandedRows里面了
    firstExpandRows: {
      type: [Array],
      default: _ => []
    },
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.insuranceOrgId = jlssbCode
    return {
      schema,
      queryObj,
      loading: false,
      dateType: ['managerDate', 'inHospitalDate', 'outHospitalDate']
    }
  },
  methods: {
    list (flag) {
      this.loading = true
      let [dateTimeStart, dateTimeEnd] = this.queryObj.managerDate
      // let [inHospitalDateStart, inHospitalDateEnd] = this.queryObj.inHospitalDate
      // let [outHospitalDateStart, outHospitalDateEnd] = this.queryObj.outHospitalDate
      if (flag) {
        this.current = 1
        this.offset = 0
      }
      let params = Object.assign({}, this.queryObj, {
        dateTimeStart: this.timeFormat(dateTimeStart, true),
        dateTimeEnd: this.timeFormat(dateTimeEnd, false),
        // inHospitalDateStart: this.timeFormat1(inHospitalDateStart),
        // inHospitalDateEnd: this.timeFormat1(inHospitalDateEnd),
        // outHospitalDateStart: this.timeFormat1(outHospitalDateStart),
        // outHospitalDateEnd: this.timeFormat1(outHospitalDateEnd),
        pagesize: this.pagesize,
        offset: this.offset
      })
      this.filterParams(params)
      if (params.sectionname) {
        params.sectionname = params.sectionname.orgSubjectName
      }
      this.api['list'](params).then(res => {
        this.loading = false
        this.$emit('update:firstExpandRows', [])
        this.tableData = res.data.map(item => {
          item.children = []
          item.loading = false // 方便内层展开时使用loading
          item.expand = false
          return item
        })
        this.totalCount = res.totalSize
      }, err => {
        this.loading = false
        console.log('err', err)
      })
    },
    filterParams (params) {
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      this.dateType.forEach((key) => {
        if (!params[key] || params[key].length < 2) {
          delete params[key]
        }
      })
    },
    resetForm () {
      this.$refs.form.resetForm()
    },
    // 展开第二层事件
    handleExpandClick (row, expandedRows) {
      this.$emit('expandEvent', row, expandedRows)
    },
    // 展开第三层事件
    handleExpandClickInner (row, expandedRows) {
      this.$emit('expandThirdlayer', row, expandedRows)
    },
    handleSelection (selection) {
      this.$emit('selection-change', selection)
    },
    timeFormat (time, startOrEnd) {
      return time && this.$moment(time).format(`YYYYMMDD${startOrEnd ? '000000' : '235959'}`)
    },
    timeFormat1 (time) {
      return time && this.$moment(time).format('YYYYMMDD')
    },
    // 三层数据分页,每页显示数量变更
    handleSizeChange_inner (val, row) {
      row.pageParams.pagesize = val
      row.pageParams.current = 1 // 切换size时，自动重置current
      row.pageParams.offset = (row.pageParams.current - 1) * row.pageParams.pagesize
      this.$emit('thirdPaginationSizeChange', row)
    },
    // 三层数据分页,当前页码变更
    handleCurrentChange_inner (val, row) {
      row.pageParams.current = val
      row.pageParams.offset = (val - 1) * row.pageParams.pagesize || 0
      this.$emit('thirdPaginationCurrentChange', row)
    },
    // 医保机构切换
    medicalOrgChange (val) {
      this.$emit('medicalOrgChange', val)
    }
  },
  filters: {
    treatType (val) {
      return treatType[val]
    },
    settleStatus (val) {
      return settleStatus[val]
    },
    tradeType (val) {
      let index = tradeType.find(item => item.id === val)
      return index && index.name
    },
    uploadStatus (val) {
      return uploadStatus[val]
    },
    uploadTradeType (val) {
      return uploadTradeType[val]
    },
    medicalChargeLevel (val) {
      return medicalChargeLevel[val]
    },
    jlsbTradeType (val) {
      return jlsbTradeType[val]
    },
    itemType (val) {
      return itemType[val]
    },
    itemClass (val) {
      return itemClass[val]
    },
    personType (val) {
      return personType[val]
    }
  },
  components: {
    medicalOrgList
  }
}
</script>
<style scoped>
.btns {
  margin-left: 15px;
}
.medicalTable /deep/ td.el-table__expanded-cell {
  padding: 0 0 10px 50px;
}
</style>
