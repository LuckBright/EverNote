<template>
  <div class="layout_inner">
    <ever-form2 ref="form" :schema="schema" v-model="queryObj" @query="list(true)" :span="6">
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
                    <el-table-column label="医院收费项目名称" prop="hisName" show-overflow-tooltip></el-table-column>

                    <el-table-column label="上传状态" prop="status">
                      <template slot-scope="scope">{{scope.row.status | UploadStatus}}</template>
                    </el-table-column>
                    <el-table-column label="药品等级" prop="drugLevel"></el-table-column>
                    <el-table-column label="自付比例" prop="selfPayRate"></el-table-column>
                    <el-table-column label="金额" prop="feeAll">
                      <template slot-scope="scope">{{scope.row.feeAll | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="进入统筹金额" prop="medicalFee">
                      <template slot-scope="scope">{{scope.row.medicalFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="乙类个人自理金额" prop="selfPayBfee">
                      <template slot-scope="scope">{{scope.row.selfPayBfee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="乙类药支付金额" prop="medicalPayBFee">
                      <template slot-scope="scope">{{scope.row.medicalPayBFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="甲类药品费" prop="adrugFee">
                      <template slot-scope="scope">{{scope.row.adrugFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="乙类药品费" prop="bdrugFee">
                      <template slot-scope="scope">{{scope.row.bdrugFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="普通诊疗费" prop="ndrugFee">
                      <template slot-scope="scope">{{scope.row.ndrugFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="高精尖诊疗费" prop="odrugFee">
                      <template slot-scope="scope">{{scope.row.odrugFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="床位费" prop="bedFee">
                      <template slot-scope="scope">{{scope.row.bedFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="自费费用" prop="selfPayFee">
                      <template slot-scope="scope">{{scope.row.selfPayFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="最高限价" prop="maxFee">
                      <template slot-scope="scope">{{scope.row.maxFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="自费原因" prop="selfPayReason"></el-table-column>
                    <el-table-column label="自费药品" prop="selfPayDrugFee">
                      <template slot-scope="scope">{{scope.row.selfPayDrugFee | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="自费诊疗" prop="selfPayItem"></el-table-column>
                    <el-table-column label="项目类别" prop="itemType">
                      <template slot-scope="scope">{{scope.row.itemType | itemType}}</template>
                    </el-table-column>
                    <el-table-column label="中心费用类别" prop="itemClass"></el-table-column>
                    <el-table-column label="处方号" prop="recipeNo" show-overflow-tooltip></el-table-column>
                    <el-table-column label="处方日期" prop="recipeDate" show-overflow-tooltip></el-table-column>
                    <el-table-column label="中心项目编码" prop="itemCode"></el-table-column>
                    <el-table-column label="单价" prop="unitPrice">
                      <template slot-scope="scope">{{scope.row.unitPrice | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="数量" prop="count"></el-table-column>
                    <el-table-column label="金额" prop="sum">
                      <template slot-scope="scope">{{scope.row.sum | formatToFinacial}}</template>
                    </el-table-column>
                    <el-table-column label="剂型" prop="dose"></el-table-column>
                    <el-table-column label="规格" prop="specification"></el-table-column>
                    <el-table-column label="处方医生姓名" prop="drName"></el-table-column>
                    <el-table-column label="处方科室" prop="sectionName"></el-table-column>
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
              <el-table-column label="交易类型" prop="tradeType">
                <template slot-scope="scope">{{scope.row.tradeType | medSettleTradeType}}</template>
              </el-table-column>
              <el-table-column label="结算状态" prop="settleStatus">
                <template slot-scope="scope">{{scope.row.settleStatus | settleStatus}}</template>
              </el-table-column>
              <el-table-column label="费用合计" prop="totalFee">
                <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="帐户支付" prop="personCountPay">
                <template slot-scope="scope">{{scope.row.personCountPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="统筹支付" prop="overallPay">
                <template slot-scope="scope">{{scope.row.overallPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="个人现金支付" prop="cash">
                <template slot-scope="scope">{{scope.row.cash | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="公务员统筹支付" prop="functionarySubsidyPay">
                <template slot-scope="scope">{{scope.row.functionarySubsidyPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="离休统筹支付" prop="leaveSubsidyPay">
                <template slot-scope="scope">{{scope.row.leaveSubsidyPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="救助金支出" prop="salvageFundPay">
                <template slot-scope="scope">{{scope.row.salvageFundPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="工伤统筹支付" prop="injuryJobFee">
                <template slot-scope="scope">{{scope.row.injuryJobFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="生育统筹支付" prop="babyFee">
                <template slot-scope="scope">{{scope.row.babyFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="医院负担金额" prop="hosFee">
                <template slot-scope="scope">{{scope.row.hosFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本次事业工伤统筹支付" prop="thisInjuryJobFee">
                <template slot-scope="scope">{{scope.row.thisInjuryJobFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本次照顾费统筹支付" prop="thisTakeFee">
                <template slot-scope="scope">{{scope.row.thisTakeFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="自费金额" prop="selfpay">
                <template slot-scope="scope">{{scope.row.selfpay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="乙类个人自付" prop="classBSelfFee">
                <template slot-scope="scope">{{scope.row.classBSelfFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="乙类药支付" prop="classBDrugFee">
                <template slot-scope="scope">{{scope.row.classBDrugFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="进入统筹" prop="basicMedicalFee">
                <template slot-scope="scope">{{scope.row.basicMedicalFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="甲类药品费" prop="classaFee">
                <template slot-scope="scope">{{scope.row.classaFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="乙类药品费" prop="classbFee">
                <template slot-scope="scope">{{scope.row.classbFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="普通诊疗费" prop="normalFee">
                <template slot-scope="scope">{{scope.row.normalFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="高精尖诊疗费" prop="highFee">
                <template slot-scope="scope">{{scope.row.highFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="床位费" prop="bedFee">
                <template slot-scope="scope">{{scope.row.bedFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="个人帐户余额" prop="accountBalance">
                <template slot-scope="scope">{{scope.row.accountBalance | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="个人负担金额（自付比例）" prop="sincePayRate"></el-table-column>
              <el-table-column label="个人自理" prop="selfpayFee">
                <template slot-scope="scope">{{scope.row.selfpayFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="分段帐户支付" prop="overallSelfPay">
                <template slot-scope="scope">{{scope.row.overallSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="起付线" prop="standardSelfPay">
                <template slot-scope="scope">{{scope.row.standardSelfPay | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本次住院次数" prop="hosCount"></el-table-column>
              <el-table-column label="收据号" prop="feeNo" width="100"></el-table-column>
              <el-table-column label="自费药品" prop="selfPayDrugFee">
                <template slot-scope="scope">{{scope.row.selfPayDrugFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="自费诊疗" prop="selfPayItem"></el-table-column>
              <el-table-column label="住院天数" prop="hosDays"></el-table-column>
              <el-table-column label="本年支付累计" prop="yearCumulative">
                <template slot-scope="scope">{{scope.row.yearCumulative | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="干部病床照顾费垫付" prop="cadreFee">
                <template slot-scope="scope">{{scope.row.cadreFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="商保大额支付金额" prop="bigFee">
                <template slot-scope="scope">{{scope.row.bigFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="高精尖2诊疗费" prop="highTwoFee">
                <template slot-scope="scope">{{scope.row.highTwoFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="本次照顾费企业垫付" prop="companyFee">
                <template slot-scope="scope">{{scope.row.companyFee | formatToFinacial}}</template>
              </el-table-column>
              <el-table-column label="单病种结算标识" prop="diseaseSpeciesSettlement"></el-table-column>
              <el-table-column label="结算人次" prop="settlementPersonTimes"></el-table-column>
              <el-table-column label="补充医疗保险支付" prop="supplementFee">
                <template slot-scope="scope">{{scope.row.supplementFee | formatToFinacial}}</template>
              </el-table-column>
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
        <el-table-column prop="doctorType" label="人员类别" show-overflow-tooltip width="90"></el-table-column>
        <el-table-column prop="visitNumber" label="住院号" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="personName" width="90" show-overflow-tooltip label="患者名称"></el-table-column>
        <el-table-column prop="cardNo" label="卡号" width="100"></el-table-column>
        <el-table-column prop="insuranceOrgName" show-overflow-tooltip label="保险机构"></el-table-column>
        <el-table-column prop="insuranceProductName" show-overflow-tooltip label="保险产品"></el-table-column>
        <el-table-column prop="sectionName" label="科室名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drName" width="90" show-overflow-tooltip label="医生姓名"></el-table-column>
        <el-table-column prop="managerDate" label="挂号日期" width="90">
          <template
            slot-scope="scope"
          >{{scope.row.managerDate&&scope.row.managerDate.substring(0,8)}}</template>
        </el-table-column>
        <el-table-column prop="hospitalizedStartDate" label="入院日期" width="90">
          <template
            slot-scope="scope"
          >{{scope.row.hospitalizedStartDate&&scope.row.hospitalizedStartDate.substring(0,8)}}</template>
        </el-table-column>
        <el-table-column prop="inDiagnosisName" label="入院疾病" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hospitalizedEndDate" label="出院日期" width="90"></el-table-column>
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
import { treatType, settleStatus, tradeType, invoiceType, uploadStatus, uploadTradeType, medicalChargeLevel, medSettleTradeType } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { itemType } from '@/rcm/otmdiscomponent/config-js/jljh-regInfo-config.js'
import { jljhCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
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
  },
  span: 6
},
{
  label: '住院号',
  name: 'visitNumber',
  span: 6
},
{
  label: '科室',
  name: 'sectionname',
  comp: 'everSubjectSelect',
  props: {
    type: 'select',
    fileds: ['id']
  },
  span: 6
},
{
  label: '挂号时间',
  name: 'managerDate',
  comp: 'everRangePicker',
  span: 6,
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
  span: 6,
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
  span: 6,
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
    }
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.insuranceOrgId = jljhCode
    return {
      schema,
      queryObj,
      jljhCode,
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
        insuranceOrgId: this.jljhCode,
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
      if (index) {
        return index.name
      } else {
        return '医保未登记'
      }
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
    itemType (val) {
      return itemType[val]
    },
    UploadStatus (val) {
      return val === 1 ? '上传' : '撤销'
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
