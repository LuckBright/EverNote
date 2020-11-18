<template>
  <div class="layout_inner">
    <ever-form2 :schema="schema" v-model="obj" :isQuery="true" :inline="true">
      <template slot="btns">
        <el-button type="primary" size="small" @click="list(true)">查询医保</el-button>
        <el-button type="primary" size="small" @click="list(true)">查询全部</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </template>
      <div></div>
    </ever-form2>
    <el-row>
      <el-col :span="24" :class="feeType=='1'?'main-head1 mb20':'main-head mb20'">
        <el-button type="primary" size="small" @click="showDailyDetail">医保明细</el-button>
        <el-button type="primary" size="small" @click="showDailyDetail">查看明细</el-button>
        <el-button v-if="feeType === '1' || feeType === '0'" type="primary" size="small" @click="printHandler">打印</el-button>
        <el-button type="primary" size="small" @click="reset">数据导出</el-button>
      </el-col>
    </el-row>
    <div class="main-wrap" v-loading.body="loading">
      <el-row :gutter="20">
        <el-col :span="24" id="page1" v-if="feeType == '1'">
          <!--住院收费日结逻辑-->
          <hospitalization-dateFormPrint
            :title="feeTypeTxt(feeType,'',true)"
            :totalBenefit="totalBenefit"
            :receivableFee="receivableFee"
            :receivedFee="receivedFee"
            :subTotal="subTotal"
            :prepaymentFee="prepaymentFee"
            :operator="operator"
            :closeDate="closeDate"
            :closeBillItems="dailySettlement.details.closeBillItems"
            :dailySettlementDetail="dailySettlementDetail"
            :paymentids="paymentids"
            :totalCount="totalCount"
            :date="reportDate"
            :totalFeeF="totalFeeF"
            :totalCash="totalCash"
            :isShowInDialog="isShowInDialog"
            @getflowfeelist="getflowfeelist"
            @getBillDetail="getBillDetail"
          ></hospitalization-dateFormPrint>
        </el-col>
        <el-col :span="24" id="page1" class="breakable" v-else>
          <!--预交金日结逻辑-->
          <hospitalization-advancePayment
            :prepaymentData="prepaymentData"
            :isShowInDialog="isShowInDialog"
            @getflowfeelist="getflowfeelist"
          ></hospitalization-advancePayment>
        </el-col>
      </el-row>
    </div>
    <hospitalization-dayDialog
      ref="dailyDetail"
      :customApi="api"
      :title="feeTypeTxt(feeType,true)"
      :pTitle="feeTypeTxt(feeType,'',true)"
      :orderType="feeType"
      :date="closeTime"
      :lastCloseId="lastCloseId"
    ></hospitalization-dayDialog>
    <dailysettleto-settlecode
      :dialogtosettle.sync="dialogtosettle"
      :flowfeeData="flowfeeData"
      :title="dialogtosettleTitle"
      :isHospitali="true"
      :isBtn="isBtn"
    ></dailysettleto-settlecode>
    <!--预交金日结弹的单独的dialog-->
    <advance-payment-dialog :dialogtosettle.sync="advanceShow" :flowfeeData="flowfeeData"></advance-payment-dialog>
    <!--票据详情-->
    <billDetailDialog
      v-if="billDetailShow"
      :visible.sync="billDetailShow"
      :billDetailData="billDetailData"
    ></billDetailDialog>
  </div>
</template>

<script>
import api from '@/rcm/store/income/hospitalizationdayapi'
import HospitalizationDayDialog from './hospitalizationdaydialog'
import HospitalizationDateFormPrint from './hospitalizationdateformprint'
import DailysettletoSettlecode from './dailysettletosettlecode'
import advancePaymentDialog from './advancepaymentdialog'
import { doPrint, dateFormat } from '@/util/common'
import hospitalizationAdvancePayment from './hospitalizationadvancepayment'
import { _findIndex } from '@/util/formcustom'
import jcpjs from 'jcpjs'
import billDetailDialog from '@/rcm/page/income/dailysettlement/billdetail.dialog.vue'
let schema = [
  {
    label: '日结时间',
    name: 'registerTime',
    comp: 'everRangePicker',
    props: {
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  },
  {
    label: '',
    name: 'btns',
    labelWidth: '15px',
    comp: 'custom'
  }
]
export default {
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      api,
      paymentids: [],
      dialogtosettle: false,
      advanceShow: false,
      dialogtosettleTitle: '',
      flowfeeData: [],
      operatorId: '',
      loading: false,
      dailySettlementDetail: [[], [], []],
      objId: this.$route.query.id,
      dailySettlement: {
        feeType: this.$route.params.feeType || '1',
        operator: null,
        details: {
          closeBillItems: []
        }
      },
      closeDate: null,
      closeTime: null,
      lastCloseId: null, // 上次日结id
      feeType: this.$route.params.feeType || '1',
      update: true,
      totalCount: 0,
      totalBenefit: 0,
      receivableFee: 0,
      receivedFee: 0,
      subTotal: 0,
      prepaymentFee: 0,
      reportDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      doPrint,
      dateFormat,
      prepaymentData: {
        subTotal: [],
        depositLogs: []
      }, // 预交金
      isBtn: false,
      totalFeeF: 0,  // 住院收费日结中退款合计
      totalCash: 0, // 住院收费日结中应交现金
      isShowInDialog: this.$route.query.isShowInDialog, // 在日结缴款弹窗显示，链接按钮全部消失
      billDetailShow: false,
      billDetailData: [],
    }
  },
  components: {
    HospitalizationDayDialog,
    HospitalizationDateFormPrint,
    DailysettletoSettlecode,
    hospitalizationAdvancePayment,
    advancePaymentDialog, // 预交金专用弹窗
    billDetailDialog // 票据详情
  },
  computed: {
    operator: {
      get () { // 优先先从日结缴款url里获取，否则，看是否有日结单id，有日结单id从接口里取如果没有就拿当前登录人
        return this.$route.query.operator || (this.objId ? this.dailySettlement.operator : this.$store.state.currentUser.name)
      }
    }
  },
  methods: {
    async getflowfeelist (methods, name) {
      this.loading = true
      let paramsName = ''
      if (this.feeType === '1') { // 住院收费
        this.isBtn = false
        if (methods === 1000) {
          paramsName = 'getAdvancePaymentList'
        } else {
          if (this.lastCloseId) {
            paramsName = 'getIpTradeLogByPayMethodById'
          } else {
            paramsName = 'getIpTradeLogByPayMethod'
          }
        }
      } else { // 预交金
        this.isBtn = true
        if (this.lastCloseId) {
          paramsName = 'getDepositLogByPayMethodById'
        } else {
          paramsName = 'getDepositLogByPayMethod'
        }
      }
      if (paramsName) {
        let params = { payMethod: methods }
        if (this.lastCloseId) {
          params.ipCloseId = this.lastCloseId
        }
        api[paramsName](params).then(res => {
          this.loading = false
          if (res && res.head && res.head.errCode === 0) {
            this.flowfeeData = res.data
            if (methods === 1000) {
              this.advanceShow = true
            } else {
              this.dialogtosettleTitle = name
              this.dialogtosettle = true
            }
          }
        }).catch(() => {
          this.loading = true // 避免接口调用错误，loading还在
        })
      }
    },
    printHandler () {
      var mydoc = {
        documents: document,
        settingsId: this.feeType === '1' ? '财务日结单' : '',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      jcpjs.getJCP().printPreview(mydoc)
    },
    // 预交金
    async getPayment () {
      const result = await api.getDepositCloseInfo({ tollCollectorId: this.operatorId })
      if (result && result.head && result.head.errCode === 0) {
        this.closeTime = result.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
        this.dailySettlement.details.closeBillItems = result.data.depositLogs
        this.prepaymentData = result.data
        this.prepaymentData.subTotal = this.prepaymentData.subTotal.filter((item) => (Number(item.charge !== 0) || (Number(item.refund !== 0))))
      }
    },
    // 日结
    async getSettlement () {
      this.loading = true
      // 初始化上次日结人员id
      this.lastCloseId = null
      // 初始化日结数据结构
      this.dailySettlement = {
        feeType: this.$route.params.feeType || '1',
        operator: null,
        details: {
          closeBillItems: []
        }
      }
      this.totalCount = 0
      if (this.feeType === '1') { // 住院收费日结
        // 兼顾日结缴款的弹窗，要查某个人的未日结信息
        const result = await api.getIpCashierCloseInfo({ tollCollectorId: this.operatorId })
        if (result && result.head && result.head.errCode === 0) {
          this.billDetailData = result.billNoteQueryList
          this.writeDataToipCasher(result)
        }
      } else { // 预交金日结
        this.getPayment()
      }
      this.loading = false
    },
    feeTypeTxt (val, isDetail, isPrint) {
      let str
      switch (val) {
        case '1':
          str = '住院'
          break
        case '0':
          str = '预交金'
          break
        default:
          str = ''
      }
      if (isPrint) {
        return str + '收费日结汇总表'
      } else {
        if (isDetail) {
          return str + '日结明细'
        } else {
          return str + '日结'
        }
      }
    },
    async createDailySettlementFn (type) {
      try {
        await this.$confirm('是否确认结账', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        api.close({ type }).then(res => {
          if (res && res.head && res.head.errCode === 0) this.update = !this.update
        })
      } catch (err) {
        console.log('取消')
      }
    },
    // 从列表传出数据，查看历史日结详情
    showDetail (id) {
      this.lastCloseId = id
      let params = {
        ipCloseId: id
      }
      if (this.feeType === '1') {
        api.getIpCashierCloseInfoById(params).then(res => {
          this.billDetailData = res.billNoteQueryList
          this.writeDataToipCasher(res)
        })
      } else {
        api.getDepositCloseInfoById(params).then(res => {
          this.prepaymentData = Object.assign({}, res.data)
        })
      }
    },
    reset () {
      // 点击重置之后，将url中的id去掉，然后调用当然日结信息
      this.$router.replace({
        path: this.$route.path,
        query: {}
      })
      // 清除该closeid，避免影响查看明细和打印
      this.lastCloseId = ''
      this.getSettlement()
    },
    showDailyDetail () {
      this.$refs.dailyDetail.onDialogOpen()
    },
    writeDataToipCasher (result) {
      // 这三个数组的清空如果放到外面，如果接口重复调用会出异步问题
      this.dailySettlementDetail[0] = []
      this.dailySettlementDetail[1] = []
      this.dailySettlementDetail[2] = []
      const settlementRes = result.data
      this.reportDate = result.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.closeTime = result.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.receivableFee = settlementRes.receivableFee
      this.totalBenefit = settlementRes.totalBenefit
      this.receivedFee = settlementRes.receivedFee
      this.subTotal = settlementRes.subTotal
      this.totalCount = settlementRes.totalCount
      this.closeDate = dateFormat(settlementRes.lastCloseTime)
      this.dailySettlement.operator = settlementRes.cashierName
      if (settlementRes.feeClass) {
        this.dailySettlement.details.closeBillItems = settlementRes.feeClass
        this.dailySettlement.details.closeBillItems.forEach((item, index) => {
          // let midNum = this.dailySettlement.details.closeBillItems.length > 7 ? Math.ceil(this.dailySettlement.details.closeBillItems.length / 2) : 7
          if (index % 3 === 0) {
            this.dailySettlementDetail[0].push(item)
          } else if (index % 3 === 1) {
            this.dailySettlementDetail[1].push(item)
          } else {
            this.dailySettlementDetail[2].push(item)
          }
          // if (this.dailySettlementDetail[0].length > this.dailySettlementDetail[1].length) {
          //   this.dailySettlementDetail[1].push({itemClassName: '', fee: '', itemClass: ''})
          // }
        })
      }
      if (settlementRes.feeLogs) {
        this.paymentids = settlementRes.feeLogs
        let prepaymentIndex = _findIndex(this.paymentids, 1000, 'payMethod')
        if (prepaymentIndex > -1) {
          this.prepaymentFee = this.paymentids[prepaymentIndex].flowFee
          this.paymentids.splice(prepaymentIndex, 1)
        } else { this.prepaymentFee = 0 }

        let totalFee = 0
        let totalFeeF = 0
        for (let i = 0; i < this.paymentids.length; i++) {
          if (this.paymentids[i].payMethod === settlementRes.feeLogsF[i].payMethod) {
            this.paymentids[i]['flowFeeF'] = settlementRes.feeLogsF[i].flowFee
            this.paymentids[i]['sumZF'] = this.paymentids[i].flowFee + this.paymentids[i].flowFeeF
            totalFee += this.paymentids[i].flowFee
            totalFeeF += this.paymentids[i].flowFeeF
          }
        }
        this.paymentids = this.paymentids.filter((item) => (Number(item.flowFee) !== 0) || (Number(item.flowFeeF) !== 0))
        let cashIndex = _findIndex(this.paymentids, 1, 'payMethod')
        if (cashIndex > -1) {
          this.totalCash = this.paymentids[cashIndex].sumZF
        } else {
          this.totalCash = 0
        }
        // 退款合计
        this.totalFeeF = totalFeeF
        // 计算合计
        this.paymentids.push({ payName: '合计', flowFee: totalFee, flowFeeF: totalFeeF, sumZF: totalFee + totalFeeF })
      }
    },
    getBillDetail () {
      this.billDetailShow = true
    }
  },
  watch: {
    '$route': {
      async handler (cur, old) {
        // operatorId优先处理从日结缴款url上带过来的，然后再说日结本身的
        this.operatorId = this.$route.query.operatorId || this.$store.state.currentUser.userId
        this.objId = cur.query.id
        this.feeType = cur.params.feeType
        if (!this.objId) {
          await this.getSettlement()
        } else {
          this.showDetail(this.objId)
        }
      },
      deep: true,
      immediate: true
    },
    'update': {
      async handler (cur, old) {
        await this.getSettlement()
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import "src/assets/css/spe_table";
.layout_inner {
  flex: 1;
  overflow: scroll;
}
.main-head {
  padding: 0 50px;
  text-align: right;
}
.main-head1 {
  padding: 0 10px;
  text-align: right;
}
</style>
