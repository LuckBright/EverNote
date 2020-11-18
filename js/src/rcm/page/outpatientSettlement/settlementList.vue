<!--
 * @Author: renpengfei
 * @Date: 2019-08-08 14:50:52
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-12-03 17:59:25
 -->
<template>
  <div class="settlelist">
    <div v-show="tableData.length>0" style="text-align:right;">
      <el-button type="primary" @click="disputeRefund">纠纷退费</el-button>
      <el-button @click="seeDetail">全部账单明细</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%;" v-loading="tableLoading">
      <el-table-column prop="chargeStatus" label="付费状态">
        <template slot-scope="scope">{{scope.row.chargeStatus | chargeStatus}}</template>
      </el-table-column>
      <el-table-column prop="refundStatus" label="退费状态">
        <template slot-scope="scope">{{scope.row.refundStatus | refundStatus}}</template>
      </el-table-column>
      <el-table-column prop="patientName" label="患者姓名" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="outpatientNumber"
        label="门诊档案号"
        min-width="100px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="settlecode" label="结算单号" min-width="140px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="settleMethod" label="结算方式"></el-table-column>
      <el-table-column prop="newSettleStatus" label="结算状态"></el-table-column>
      <el-table-column prop="createTime" label="结算时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalFee" label="原价小计" align="right">
        <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="payList(scope.row.id)">支付流水</el-button>
          <el-button type="primary" size="small" @click="detailBtn(scope.row)">单据详情</el-button>
          <el-dropdown v-if="checkShowMore(scope.row)" class="ml5 fr" @command="handleCommand">
            <span class="el-dropdown-link f12">
              更多
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="checkJinsui(scope.row)"
                :command="{invoice: 'nationalTax', row: scope.row}"
              >国税发票</el-dropdown-item>
              <el-dropdown-item
                :command="{invoice: 'settleDetailPrint', row: scope.row}"
              >打印费用明细</el-dropdown-item>
              <el-dropdown-item
                v-if="checkRefundPrint(scope.row)"
                :command="{invoice: 'refundPrint', row: scope.row}"
              >打印收据</el-dropdown-item>
              <el-dropdown-item
                v-if="checksdllprint(scope.row)"
                :command="{invoice: 'sdllPrintPdf', row: scope.row}"
              >结算单打印</el-dropdown-item>
              <el-dropdown-item
                v-if="checkPrint(scope.row)"
                :command="{invoice: 'printsettle', row: scope.row}"
              >打印收据</el-dropdown-item>
              <el-dropdown-item
                v-if="checkPrintAgain(scope.row)"
                :command="{invoice: 'printAgain', row: scope.row}"
              >收据重打</el-dropdown-item>
              <el-dropdown-item
                v-if="checkPrintPatch(scope.row)"
                :command="{invoice: 'printPatch', row: scope.row}"
              >收据补打</el-dropdown-item>
              <el-dropdown-item
                v-if="checkItemRefund(scope.row)"
                :command="{invoice: 'itemRefund', row: scope.row}"
              >项目退费</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <medicalsettlementprint :printinfo="medicalprintobj" v-show="false"></medicalsettlementprint>
    <div v-show="false">
      <settlementtemprint :printinfo="printObj" id="page1"></settlementtemprint>
    </div>
    <!-- 支付方式二 -->
    <paymethodstwo
      :dialogVisible.sync="paydialogVisible"
      :obj="obj"
      @payStatus="payStatus"
      @closedialog="closedialog"
    ></paymethodstwo>
    <!-- 原路退 -->
    <originalroadrefund
      v-if="refunddialogVisible"
      :refunddialogVisible.sync="refunddialogVisible"
      :paramsObj="refundOriginParams"
      @sureRefund="sureRefund"
      @beforeClose="originalroadrefundClose"
    ></originalroadrefund>
    <!-- 项目退费 -->
    <refunddialog
      :refundvisiable.sync="refundvisiable"
      :refundTableData="refundTableData"
      @savedata="validAuthorize"
    ></refunddialog>
    <el-dialog title="支付流水" :visible.sync="dialogVisible" width="50%">
      <template>
        <el-table :data="payData" style="width: 100%" v-loading="payLoading">
          <el-table-column prop="payName" label="支付方式"></el-table-column>
          <el-table-column prop="payTime" label="支付时间"></el-table-column>
          <el-table-column prop="flowFee" label="支付金额" align="right">
            <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="payState" label="状态">
            <template slot-scope="scope">{{scope.row.payStatus}}</template>
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <!-- 金额退费 -->
    <dispute-refund-log ref="disputrefund" @refundCall="refundCall" :refundObj="refundObj"></dispute-refund-log>
    <!-- 授权弹窗 -->
    <authorize-log
      ref="authorizelog"
      @confirmCallback="authorizeconfirm"
      :callbackVal="callbackVal"
      :callbackValue="callbackValue"
      :typeCode="typeCode"
      :patientId="patientId"
      :visitNumber="visitNumber"
    ></authorize-log>
    <!-- 山东乐陵结算单打印 -->
    <printpdf v-show="false" ref="printpdf"></printpdf>
  </div>
</template>

<script>
import {
  getSettlementsByVisitNumber,
  refundDetail,
  registerItemRefund,
  billrefundOrigin,
  confirmRefund,
  disputeRefund
} from '@/rcm/store/outpatient/outpatient'
import authApi from '@/rcm/store/outpatient/auth.manage.api.js'
import medicalsettlementprint from '@/rcm/page/medicalsettle-print'
import settlementtemprint from '@/rcm/page/settlement-tem-print'
import { everprint } from '@/util/common'
import settlementapi, { getRecipesBySettlementId } from '@/rcm/store/settlementapi'
import invoice from '@/rcm/page/invoicemanage/invoice'
import refunddialog from '@/rcm/page/outpatientSettlement/refunddialog.vue'
import disputeRefundLog from './dispute.refund.log'
import AuthorizeLog from './authorize.log'
import originalroadrefund from '@/rcm/page/pay/originalroadrefund'
import commonReceiptPrinting from '@/rcm/page/outpatientSettlement/common.receipt.printing'
import authorizeInfo from '@/rcm/page/outpatientSettlement/authorizeinfo.js'
import printpdf from '@/rcm/page/outpatientSettlement/printpdf/printpdf.vue'
export default {
  mixins: [invoice, commonReceiptPrinting],
  components: {
    settlementtemprint,
    medicalsettlementprint,
    refunddialog,
    AuthorizeLog,
    disputeRefundLog,
    originalroadrefund,
    printpdf
  },
  data () {
    return {
      refunddialogVisible: false,
      paydialogVisible: false,
      refundTableData: [],
      refundvisiable: false,
      salaryRefundvisiable: false, // 金额退费
      isShowDetail: false,
      payData: [],
      payLoading: false,
      dialogVisible: false,
      tableData: [],
      tableLoading: false,
      medicalprintobj: {
        settlementDetail: []
      },
      obj: {
        iscallback: true,
        isRefund: true,
        loading: false,
        // 支付方式
        paymethodArr: [],
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: '1',
        isValited: true,
        // 还需支付
        unexefee: 0,
        // 已收金额
        exefee: 0,
        // 总额
        totalFee: 0,
        settlementid: this.$route.query.settlementid,
        id: '',
        patientid: '',
        settleCode: ''
      },
      printObj: {
        printfee: 0,
        mergedSettleDetail: [],
        details: {
          settlementDetail: [],
          settlementComInsurDet: [],
          settlementCouponDet: [],
          settlementMemberDet: [],
          settlementBenefitDet: []
        }
      },
      rowdata: {},
      clinic: this.$ever.clinic,
      iframeSrcArr: [],
      printInfo: { id: '', code: '' },
      // 按金额退费的对象
      refundObj: {
        patientName: '',
        outpatientNumber: ''
      },
      callbackVal: '', // 回调函数的函数名字
      callbackValue: '', // 回调函数的传参
      authorizeInfo: authorizeInfo,
      visitNumber: this.$route.query.visitNumber,
      patientId: this.$route.query.patientId,
      typeCode: '',
      receiptPrintInfo: {},
      isHcjk: false,
      // 原路退费的对象
      refundOriginParams: {
        id: '',
        partialRefund: false,
        recollect: false,
        paymethodArr: [],
        unexefee: 0,
        wipeOffFee: 0,
        refundMethod: '0'
      },
    }
  },
  mounted () {
    var parent = document.getElementById('wm_div_id')
    parent ? (parent.style = 'display:none') : null
    this.isHcjk = this.$ever.getClinicConfig().clinicType === 'hcjk'
  },
  watch: {
    '$route.query': {
      handler: function (val, oldval) {
        this.getList()
      }
    }
  },
  created () {
    this.getList()
    // 获取授权列表
    this.getAuthList()
  },
  methods: {
    disputeRefund () {
      this.refundObj.patientName = this.tableData[0]['patientName']
      this.refundObj.outpatientNumber = this.tableData[0]['outpatientNumber']
      this.$refs.disputrefund.visible = true
    },
    refundCall (obj) { // obj是退费金额等参数
      let info = this.authorizeInfo.find(item => item.code === 'dispute_auth')
      if (info && info.status) {
        this.typeCode = 'dispute_auth'
        this.callbackVal = 'dispute'
        this.callbackValue = obj
        this.$refs.authorizelog.visible = true
      } else {
        this.dispute(obj)
      }
    },
    dispute (callbackParams, authInfo) {
      let params = {
        ...callbackParams,
        patientId: this.patientId
      }
      if (authInfo && authInfo.authorizerId) {
        params.authorizerId = authInfo.authorizerId
      }
      disputeRefund(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功')
          this.$refs.disputrefund.visible = false
        }
      }).catch((err) => {
        console.log('err', err)
      })
    },
    seeDetail () {
      this.$router.push({
        path: '/rcm/reconstruct/settleddetail',
        query: Object.assign({}, this.$route.query)
      })
    },
    handleCommand (command) {
      this.rowdata = command.row
      let rowId = command.row.id
      switch (command.invoice) {
        case 'nationalTax': // 国税发票
          this.findInvoiceByIds({ id: rowId })
          break
        case 'obsolete': // 发票作废
          this.cancelInvoices({ id: rowId })
          break
        case 'itemRefund': // 按项目退费
          this.refundBtn(command.row)
          break
        case 'salaryRefund': // 按金额退费
          this.salaryRefund(command.row)
          break
        case 'refundPrint': // 退费的单子打印
          this.refundPrint(command.row)
          break
        case 'sdllPrintPdf': // 山东乐陵结算单打印
          this.sdllPrintPdf(command.row)
          break
        case 'printsettle': // 收据打印
          this.printsettle(command.row.id, command.row.status, command.row.ordertype, command.row.medInsurance, command.row.insuranceType, command.row.rootorderid, command.row.returnFlag, 1)
          break
        case 'settleDetailPrint': // 打印费用明细
          this.settleDetailPrint(command.row)
          break
        case 'printAgain': // 收据重打
          this.printsettle(command.row.id, command.row.status, command.row.ordertype, command.row.medInsurance, command.row.insuranceType, command.row.rootorderid, command.row.returnFlag, 2)
          break
        case 'printPatch': // 收据补打
          this.printsettle(command.row.id, command.row.status, command.row.ordertype, command.row.medInsurance, command.row.insuranceType, command.row.rootorderid, command.row.returnFlag, 3)
          break
      }
    },
    getAuthList () {
      authApi.authList().then(rs => {
        if (!rs.head.errCode) {
          this.authorizeInfo = rs.data
        } else {
          this.$messageTips(this, 'error', '授权列表获取失败')
        }
      })
    },
    // 项目退费入口
    savedata (params) {
      if (params.registerFlag) { // 挂号的，要直接支付，不进入待退费
        this.registerItemRefund(params)
      } else { // 处方的，进入待退费
        this.receiptItemRefund(params)
      }
    },
    // 项目退费->处方退费
    async receiptItemRefund (params) {
      try {
        let data = await refundDetail(params)
        if (data && data.data) {
          this.refundvisiable = false
          let routerParams = this.$route.query
          if (routerParams.settlementid) {
            delete routerParams.settlementid
          }
          this.$router.push({
            path: '/rcm/reconstruct/refunded',
            query: routerParams
          })
        }
      } catch (err) {
        console.log('err', err)
      }
    },
    // 项目退费->挂号相关
    registerItemRefund (params) {
      registerItemRefund(params).then(res => {
        // 关闭项目退费弹窗
        this.refundvisiable = false
        const { settlementInfo } = res.data
        Object.assign(this.obj, settlementInfo)
        this.billrefundOriginRoad(settlementInfo)
      }).catch((err) => {
        console.log('err', err)
      })
    },
    // 原路退
    billrefundOriginRoad (data) {
      const { id, returnId, recollect } = data
      let params = { settlementId: returnId }
      billrefundOrigin(params).then(res => {
        // 记录退费新生成的id
        const { refundFlowList, partialRefund, refundFee, wipeOffFee } = res.data
        this.refundOriginParams.id = id
        this.refundOriginParams.partialRefund = partialRefund // 标识是部分退还是全退
        this.refundOriginParams.recollect = recollect
        this.refundOriginParams.paymethodArr = refundFlowList
        this.refundOriginParams.unexefee = refundFee
        this.refundOriginParams.wipeOffFee = wipeOffFee
        this.refundOriginParams.refundMethod = this.obj.parameters.refund_method
        this.refunddialogVisible = true
      }, err => {
        console.log('err', err)
      })
    },
    // 确定待退费
    sureRefund ({ feeList }) {
      let params = {
        reSettle: this.refundOriginParams.recollect,
        settlementId: this.refundOriginParams.id,
        refundFlowList: feeList
      }
      confirmRefund(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.refunddialogVisible = false
        this.getList()
      }).catch((err) => {
        console.log('err', err)
      })
    },
    // 原路退费，直接关掉支付弹窗
    originalroadrefundClose (done) {
      this.getList()
      done()
    },
    // 支付成功回掉
    payStatus (row) {
      this.getList()
    },
    // 关闭前回调
    async closedialog (done) {
      this.getList()
      done()
    },
    printFee () {
      let that = this
      let fee = 0
      for (var v in that.printObj.payDetails) {
        if (v !== '会员卡支付') {
          fee += that.printObj.payDetails[v]
        }
      }
      return fee.toFixed(2)
    },
    detailBtn (row) {
      this.rowdata = row
      this.$router.push({
        path: '/rcm/reconstruct/settled',
        query: {
          patientId: row.patientid,
          dptId: row.orderDept,
          visitNumber: row.rootorderid,
          settlementid: row.id,
          isnoprint: true
        }
      })
    },
    payList (id) {
      let that = this
      this.dialogVisible = true
      this.payLoading = true
      settlementapi.getById(id).then(
        result => {
          this.payData = result.payTradeLog
          that.$nextTick(function () {
            that.payLoading = false
          })
        },
        errorFn => {
          that.payLoading = false
        }
      )
    },
    billPrintCall () {
      let that = this
      settlementapi.getById(this.receiptPrintInfo.id).then(
        result => {
          that.printObj = Object.assign({}, result)
          that.printObj.printfee = that.printFee()
          that.printObj.visitSn =
            result.details.settlementDetail[0].rootorderid
          that.$nextTick(function () {
            that.cardloading = false
            everprint('rcm-outpatient-bill', { id: this.receiptPrintInfo.id, patientId: this.$route.query.patientId }, { preview: true })
            // that.createPrint(id, status, ordertype, medInsurance, insuranceType, visitNumber, returnFlag )
          })
        },
        err => {
          console.log(err)
          that.cardloading = false
        }
      )
    },
    // 退费单据打印
    refundPrint (row) {
      everprint('MZ_RCM_TUI_FEI_JIE_SUAN_DAN', { id: row.id }, { preview: true })
    },
    // 山东乐陵打印pdf
    sdllPrintPdf (row) {
      this.$nextTick(() => {
        this.$refs.printpdf.getPdf(row.id)
      })
    },
    // 收据打印
    printsettle (
      id,
      status,
      ordertype,
      medInsurance,
      insuranceType,
      visitNumber,
      returnFlag,
      btnType
    ) {
      if (this.isHcjk) { // 海床打印
        everprint('thc_rcm_FEIYONGQINGDAN_LNN_20181114', {id: id}, {preview: true})
      }
      this.receiptPrintInfo = {
        id: id,
        status: status,
        ordertype: ordertype,
        medInsurance: medInsurance,
        insuranceType: insuranceType,
        visitNumber: visitNumber,
        returnFlag: returnFlag
      }
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: this.getList, // 打印成功的回调
        billPrintCall: this.billPrintCall, // 没有关联模版走老票据打印的回调
        code: 'rcm_dishui', // 模版code
        everPrintParams: null,
        settlementId: id, // settlementid
        printType: 2, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      this.receiptPrint(info)
    },
    // 打印费用明细
    settleDetailPrint (row) {
      everprint('outpatientFeeList', {id: row.id, patientId: this.$route.query.patientId}, {preview: true})
    },
    async getList () {
      this.tableLoading = true
      try {
        let params = {
          rootorderid: this.$route.query.visitNumber,
          ordertype: this.$route.query.ordertype
        }
        let data = await getSettlementsByVisitNumber(params)
        this.tableLoading = false
        // 加下面四行代码为了解决点击已结算之后，前面小圆点消失的问题
        let mergeObj = {
          existPendingCharges: data.existPendingCharges,
          existPendingRefounds: data.existPendingRefounds
        }
        this.$bus.$emit('bill:obj', mergeObj)
        if (data && data.data) {
          // 给数据加了一条btns记录操作中按钮数量，控制更多显示与否
          this.tableData = data.data.map(item => {
            item.btns = 5
            return item
          })
        }
      } catch (err) {
        this.tableLoading = false
      }
    },
    async refundBtn (row) {
      let result = await getRecipesBySettlementId({ settlementId: row.id })
      this.refundTableData = result.data
      if (this.refundTableData.length > 0) {
        this.refundvisiable = true
      } else {
        this.$messageTips(this, 'warning', '没有可退的结算明细')
      }
    },
    // 退费授权弹窗
    validAuthorize (params) {
      let info = this.authorizeInfo.find(item => item.code === 'item_refund_auth')
      if (info && info.status) {
        this.typeCode = 'item_refund_auth'
        this.callbackVal = 'savedata'
        this.callbackValue = params
        this.$refs.authorizelog.visible = true
      } else {
        this.savedata(params)
      }
    },
    // 授权的回调函数
    authorizeconfirm (callVal) {
      this[callVal.callbackVal](callVal.value, callVal.authInfo)
    },
    // 是否可以显示收据打印按钮,
    // settleStatus标识结算状态
    // requestType标识该结算单的票据打印状态
    // returnFlag标识该结算单是否是退费
    checkPrint (row) {
      return (row.settleStatus === 4 || row.settleStatus === 6) && row.requestType === 0 && row.requestType !== 4 && row.returnFlag === false
    },
    // 山东乐陵医保打印结算单
    checksdllprint (row) {
      return row.settleStatus === 4 && this.$hasPermission('sdll-settlement-print')
    },
    // 是否可以显示收据重打按钮
    checkPrintAgain (row) {
      return !this.isHcjk && ((row.settleStatus === 4 || row.settleStatus === 6) && row.allowPrintAgain && row.requestType !== 0 && row.requestType !== 4 && row.returnFlag === false)
    },
    // 是否可以显示收据补打按钮
    checkPrintPatch (row) {
      return !this.isHcjk && ((row.settleStatus === 4 || row.settleStatus === 6) && row.allowPrintNew && row.requestType !== 0 && row.returnFlag === false)
    },
    // 是否可以项目退费
    // 首先不是退费单，其次是已付费状态，再次不是处方流转平台，再次未退完，还得有资源权限
    checkItemRefund (row) {
      return row.returnFlag === false && row.chargeStatus && row.orderSource !== 4 && !row.hasRefundAll && this.$hasPermission('Auth_menu_rcm_settlements_specialrefund')
    },
    // 是否国税打印
    checkJinsui (row) {
      return this.isJinShui && row.settleStatus === 4 && this.isHcjk
    },
    // 退费收据是否可以显示
    checkRefundPrint (row) {
      return row.returnFlag && row.refundStatus && this.$hasPermission('MZ_RCM_TUI_FEI_JIE_SUAN_DAN')
    },
    checkShowMore (row) {
      return [this.checkPrint, this.checkPrintAgain, this.checkPrintPatch, this.checkItemRefund, this.checkJinsui, this.checkRefundPrint, this.checksdllprint].some(method => method.call(this, row))
    }
  },
  filters: {
    chargeStatus (val) {
      return val !== undefined ? (val === 1 ? '已付费' : '待付费') : ''
    },
    refundStatus (val) {
      return val !== undefined ? (val === 1 ? '已退费' : '待退费') : ''
    }
  }
}
</script>
<style scoped>
.settlelist /deep/ .el-table__fixed-right::before {
  height: 0;
}
.settlelist {
  overflow-y: scroll;
  padding: 15px;
  width: 100%;
}
.settle_fee .label_money_need {
  font-size: 20px;
  color: #ff9c00;
  font-weight: 400;
  vertical-align: middle;
}
.remark {
  line-height: 44px;
  margin-bottom: 12px;
}
.remark .label {
  float: left;
  width: 78px;
  font-size: 14px;
  color: #000;
  font-weight: bold;
  text-align: right;
  padding-right: 12px;
}
.remark .remarkcontent {
  float: left;
  width: 849px;
}
.settle_fee .label_money {
  font-size: 20px;
  color: #000;
  vertical-align: middle;
}
.his {
  width: 15%;
  float: left;
}
</style>

