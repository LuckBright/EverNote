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
              :data="scope.row.children"
              row-key="id"
              :expand-row-keys="scope.row.expandedRows"
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
                    <el-table-column label="卡号" prop="cardno"></el-table-column>
                    <el-table-column label="数量" prop="count"></el-table-column>
                    <el-table-column label="金额" prop="fee"></el-table-column>
                    <el-table-column label="医保自理金额" prop="insuranceSelfPay"></el-table-column>
                    <el-table-column label="医保总金额" prop="insuranceTotalFee"></el-table-column>
                    <el-table-column label="医院收费类别" prop="itemClass"></el-table-column>
                    <el-table-column label="医保收费等级" prop="chargeLevel">
                      <template slot-scope="scope">{{scope.row.chargeLevel | medicalChargeLevel}}</template>
                    </el-table-column>
                    <el-table-column label="医保中心编码" prop="itemcode"></el-table-column>
                    <el-table-column label="项目名称" prop="itemname"></el-table-column>
                    <el-table-column label="开方日期" prop="recipedate"></el-table-column>
                    <el-table-column label="状态" prop="status">
                      <template slot-scope="scope">{{scope.row.status | uploadStatus}}</template>
                    </el-table-column>
                    <el-table-column label="交易类型" prop="tradeType">
                      <template slot-scope="scope">{{scope.row.tradeType | uploadTradeType}}</template>
                    </el-table-column>
                    <el-table-column label="单位" prop="unit"></el-table-column>
                    <el-table-column label="单价" prop="unitprice"></el-table-column>
                    <el-table-column label="门诊号" prop="visitNumber"></el-table-column>
                    <el-table-column label="操作" width="220px" fixed="right">
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
              <el-table-column label="发票类型" prop="invoiceType">
                <template slot-scope="scope">{{scope.row.invoiceType | invoiceType}}</template>
              </el-table-column>
              <el-table-column label="发票号" show-overflow-tooltip prop="feeNo"></el-table-column>
              <el-table-column label="差额" prop="difMoney"></el-table-column>
              <el-table-column label="交易类型" prop="tradeType">
                <template slot-scope="scope">{{scope.row.tradeType | medSettleTradeType}}</template>
              </el-table-column>
              <el-table-column label="结算状态" prop="settleStatus">
                <template slot-scope="scope">{{scope.row.settleStatus | settleStatus}}</template>
              </el-table-column>
              <el-table-column label="生育统筹支付" prop="birthOverallPay"></el-table-column>
              <el-table-column label="个人现金支付" prop="cash"></el-table-column>
              <el-table-column label="乙类个人自理" prop="classBzili"></el-table-column>
              <el-table-column label="本次进入统筹医疗费用金额" prop="curOverallCumulative"></el-table-column>
              <el-table-column label="本年个人帐户支付金额" prop="curYearPersoncountpay"></el-table-column>
              <el-table-column label="审核扣款金额" prop="cutPayment"></el-table-column>
              <el-table-column label="公务员补助支出金额" prop="functionarySubsidyPay"></el-table-column>
              <el-table-column label="保健对象补贴支出金额" prop="healthcareSubsidyFee"></el-table-column>
              <el-table-column label="住院现金累计" prop="hosCashCumulative"></el-table-column>
              <el-table-column label="医院承担金额" prop="hosFee"></el-table-column>
              <el-table-column label="住院封顶线以上公补支出" prop="hosOverLimitGB"></el-table-column>
              <el-table-column label="住院自付部分公补支出" prop="hosSelfpayGB"></el-table-column>
              <el-table-column label="工伤统筹支付" prop="injuryOverallPay"></el-table-column>
              <el-table-column label="上次进入统筹医疗费用累计" prop="lastOverallCumulative"></el-table-column>
              <el-table-column label="上次本年个人帐户余额" prop="lastPersoncountBalance"></el-table-column>
              <el-table-column label="起付标准现金支付" prop="limitCashPay"></el-table-column>
              <el-table-column label="起付标准帐户支付" prop="limitCountPay"></el-table-column>
              <el-table-column label="起付标准自付金额" prop="limitSelfpay"></el-table-column>
              <el-table-column label="起付以上自理帐户支付" prop="limitZiliAccountPay"></el-table-column>
              <el-table-column label="居民农合大病合规医疗费" prop="nhSeriousillnessPay"></el-table-column>
              <el-table-column label="门诊慢性病月累计" prop="opChronicMonthCumulative"></el-table-column>
              <el-table-column label="超过封顶线个人自付金额" prop="overLimitSelfPay"></el-table-column>
              <el-table-column label="统筹支付金额" prop="overallPay"></el-table-column>
              <el-table-column label="统筹段自理总额" prop="overallZili"></el-table-column>
              <el-table-column label="统筹段分段1自理" prop="overallZili1"></el-table-column>
              <el-table-column label="统筹段分段2自理" prop="overallZili2"></el-table-column>
              <el-table-column label="一般起付标准" prop="payLimit"></el-table-column>
              <el-table-column label="上次个人帐户余额" prop="personcountBalance"></el-table-column>
              <el-table-column label="帐户支付金额" prop="personcountpay"></el-table-column>
              <el-table-column label="离休统筹" prop="retireOverall"></el-table-column>
              <el-table-column label="救助金支出金额" prop="salvageFundPay"></el-table-column>
              <el-table-column label="个人自费金额" prop="selfpay"></el-table-column>
              <el-table-column label="特检个人自理" prop="specialExamZili"></el-table-column>
              <el-table-column label="特治个人自理" prop="specialTreatZili"></el-table-column>
              <el-table-column label="医疗费总额" prop="totalFee"></el-table-column>

              <el-table-column label="创建人" prop="creator"></el-table-column>
              <el-table-column label="创建时间" prop="createTime" width="160">
                <template
                  slot-scope="scope"
                >{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
              </el-table-column>
              <el-table-column label="更新人" prop="updator"></el-table-column>
              <el-table-column label="更新时间" prop="updateTime" width="160">
                <template
                  slot-scope="scope"
                >{{$moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')}}</template>
              </el-table-column>
              <el-table-column label="操作" width="220" fixed="right">
                <template slot-scope="scope">
                  <slot name="innerOperations" :innerRow="scope.row"></slot>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="treatType" label="医疗类别" width="90">
          <template slot-scope="scope">{{scope.row.treatType | treatType}}</template>
        </el-table-column>
        <el-table-column prop="doctorType" label="人员类别" show-overflow-tooltip width="90">
          <template slot-scope="scope">{{scope.row.doctorType | personType}}</template>
        </el-table-column>
        <el-table-column prop="visitNumber" label="住院号" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="personName" width="90" show-overflow-tooltip label="患者名称"></el-table-column>
        <el-table-column prop="cardNo" label="卡号" width="100"></el-table-column>
        <el-table-column prop="insuranceOrgName" show-overflow-tooltip label="保险机构"></el-table-column>
        <el-table-column prop="insuranceProductName" show-overflow-tooltip label="保险产品"></el-table-column>
        <el-table-column prop="sectionName" label="科室名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drName" width="90" show-overflow-tooltip label="医生姓名"></el-table-column>
        <el-table-column prop="managerDate" label="挂号日期" width="90"></el-table-column>
        <el-table-column prop="hospitalizedStartDate" label="入院日期" width="90"></el-table-column>
        <el-table-column prop="hospitalizedEndDate" label="出院日期" width="90"></el-table-column>
        <el-table-column prop="inDiagnosisName" label="入院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="outDiagnosisName" label="出院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="macId" label="网卡地址" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tradeType" label="交易类型" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.tradeType | tradeType}}</template>
        </el-table-column>
        <el-table-column prop="operatorName" width="90" show-overflow-tooltip label="操作员"></el-table-column>
        <el-table-column prop="outprop7" label="操作" width="220">
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
import { treatType, settleStatus, tradeType, invoiceType, uploadStatus, uploadTradeType, medicalChargeLevel, medSettleTradeType, personType } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { jlccybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import list from '@/util/list'
let schema = [
  {
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
    },
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
  {
    label: '入院时间',
    name: 'inHospitalDate',
    comp: 'everRangePicker',
    props: {
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  },
  {
    label: '出院时间',
    name: 'outHospitalDate',
    comp: 'everRangePicker',
    props: {
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  },
  {
    label: '',
    labelWidth: '0',
    name: 'btns',
    comp: 'custom',
    col: {
      style: 'text-align:right;'
    }
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
    // 第三层分页
    thirdPagination: {
      type: [Object],
      default: _ => {
        return {
          current: 1,
          pageSizes: [10, 20, 30, 50],
          pagesize: 20,
          offset: 0
        }
      }
    },
    // 是否用在医保中心
    usedInMedicalCenter: Boolean
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.insuranceOrgId = jlccybCode
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
      let [inHospitalDateStart, inHospitalDateEnd] = this.queryObj.inHospitalDate
      let [outHospitalDateStart, outHospitalDateEnd] = this.queryObj.outHospitalDate
      if (flag) {
        this.current = 1
        this.offset = 0
      }
      let params = Object.assign({}, this.queryObj, {
        dateTimeStart: this.timeFormat(dateTimeStart),
        dateTimeEnd: this.timeFormat(dateTimeEnd),
        inHospitalDateStart: this.timeFormat(inHospitalDateStart),
        inHospitalDateEnd: this.timeFormat(inHospitalDateEnd),
        outHospitalDateStart: this.timeFormat(outHospitalDateStart),
        outHospitalDateEnd: this.timeFormat(outHospitalDateEnd),
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
    timeFormat (time) {
      return time && this.$moment(time).format(`YYYYMMDD`)
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
    invoiceType (val) {
      return invoiceType[val]
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
    medSettleTradeType (val) {
      return medSettleTradeType[val]
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
