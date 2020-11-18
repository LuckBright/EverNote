<template >
  <div v-loading="tabloading" class="chargedetailContainer">
    <div class="besideBtns">
      <!-- 费用明细 -->
      <charge-detail
        @getFromChild="getFromChild"
        ref="chargedetail"
        :useType="useType"
        :insuranceType="paramsObj.insuranceType"
        @refresh="refresh"
      ></charge-detail>
      <div class="settle_title">
        优惠详情
        <span style="float: right;">
          <el-button class="btntext" type="text" @click="dialogBenefitVisible1 = true">优惠详情</el-button>
          <i class="iconfont icon-sales-qiehuanjiantou jiantou"></i>
        </span>
      </div>
      <!-- 卡券选择 -->
      <gift-card-list ref="giftCardList" :obj="obj" v-if="obj.ipSettleStatus==-1"></gift-card-list>
      <!-- 优惠信息 -->
      <fee-list :obj="obj" v-if="obj.settlementId"></fee-list>
      <!-- 优惠详情 -->
      <!-- 优惠详情弹窗 -->
      <dialogbenefit :obj="obj" :dialogBenefitVisible.sync="dialogBenefitVisible1"></dialogbenefit>
      <!-- 支付记录信息 -->
      <el-row v-if="obj.settlementId&& obj.payTradeLog.length>0">
        <div class="settle_title">支付记录</div>
        <el-table
          style="width:100%"
          :data="obj.payTradeLog"
          border
          v-if="this.obj.payType==2?true:false"
        >
          <el-table-column prop="payName" label="支付方式"></el-table-column>
          <el-table-column prop="payTime" label="支付时间"></el-table-column>
          <el-table-column prop="flowFee" label="支付金额">
            <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="payState" label="状态">
            <template slot-scope="scope">{{scope.row.payStatus}}</template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    <div class="settle_btngroup clearfix">
      <el-button type="primary" class="btnright" @click="payBtn" v-if="checkPay(obj)">支付</el-button>
      <el-button
        type="primary"
        class="btnright"
        @click="settleFn(true)"
        v-if="!obj.settlementId&&obj.ipStatus==8"
      >出院结算</el-button>
      <el-button type="primary" class="btnright" @click="delFn" v-if="checkDeleteSettle(obj)">删除结算</el-button>
      <el-button
        type="primary"
        class="btnright"
        @click="medicalRegOut"
        v-if="obj.insuranceType==0&&obj.ipSettleStatus==0"
      >医保出院登记</el-button>
      <el-checkbox v-if="checkShowCheck()" v-model="isMedicalPay">使用个人账户支付</el-checkbox>
      <el-popover v-if="showReadCard()" class="btnright" placement="top-start" trigger="hover">
        <template slot="default">
          <el-button type="primary" size="mini" @click="handleHasCard(true)">有卡</el-button>
          <el-button type="primary" size="mini" @click="handleHasCard(false)">无卡</el-button>
        </template>
        <el-button slot="reference" type="primary">读卡</el-button>
      </el-popover>
      <el-button
        type="primary"
        class="btnright"
        @click="medicalSettle"
        :disabled="medicalSettleBtn"
        v-if="obj.insuranceType==0&&obj.ipSettleStatus==5"
      >医保结算</el-button>
      <!--没有出院结算单且状态在4567的时候可以中途结算-->
      <el-button
        type="primary"
        class="btnright"
        v-if="$hasPermission('Auth_menu_adt_settlements_halfsettle')&&(obj.ipStatus>=4&&obj.ipStatus<8)&&(!obj.settlementId)"
        @click="halfSettle"
      >中途结算</el-button>
      <el-button type="primary" class="btnright" @click="print(obj.ipNo, obj.settlementId)">打印费用清单</el-button>
      <el-button
        type="primary"
        class="btnright"
        v-if="obj.ipSettleStatus==3&&printStatus.requestType === 0 && printStatus.requestType !== 4"
        @click="createPrint(1)"
      >收据打印</el-button>
      <el-button
        type="primary"
        class="btnright"
        @click="createPrint(2)"
        v-if="obj.ipSettleStatus==3&&printStatus.allowPrintAgain && printStatus.requestType !== 0 && printStatus.requestType !== 4"
      >收据重打</el-button>
      <el-button
        type="primary"
        class="btnright"
        @click="createPrint(3)"
        v-if="obj.ipSettleStatus==3&&printStatus.allowPrintNew && printStatus.requestType !== 0"
      >收据补打</el-button>
      <div class="settle_needpay" v-if="obj.settlementId">
        {{obj.isRefund ? '退款金额：' : '实际应收金额：'}}
        <span
          class="cRed"
        >￥ {{obj.receivableFee | formatToFinacial}}</span>
      </div>
      <div class="settle_totalFee">
        费用总计：
        <span>￥ {{obj.billSumFee | formatToFinacial}}</span>
      </div>
    </div>
    <!-- 支付方式二 -->
    <paymethodstwo
      v-if="PayMethodTwoDialogVisible"
      :obj="obj"
      :dialogVisible.sync="PayMethodTwoDialogVisible"
      @refundStatus="listenPay"
      @payStatus="afterpay"
      @cancel="closePaymethodtwo"
    ></paymethodstwo>
    <modifyRegInfo
      v-if="medicalRegisterInfo"
      :medicalRegisterInfo.sync="medicalRegisterInfo"
      :paramObj="obj"
      @register-success="afterMedRegOut"
    ></modifyRegInfo>
    <!-- 原路退费 -->
    <refundOriginal
      v-if="refunddialogVisible"
      :refunddialogVisible.sync="refunddialogVisible"
      :paramsObj="refundOriginParams"
      @sureRefund="handleRefund"
    ></refundOriginal>
    <!-- 医保卡读卡信息弹窗 -->
    <dialogmedicalinfo
      :insuranceOrgId="paramsObj.insuranceOrgId"
      :hasCard="hasCard"
      @getMedDetails="getMedDetailsEvent"
      ref="medicalinfo"
    ></dialogmedicalinfo>
  </div>
</template>
<script>
import chargeDetail from '@/rcm/page/hospitalization/chargedetail'
import giftCardList from '@/rcm/page/hospitalization/giftcardlist'
import feeList from '@/rcm/page/hospitalization/feelist'
import dialogbenefit from './dialog-benefit'
import dialoginverse from './inversesettlement'
import { everprint } from '@/util/common'
import {
  halfSettle,
  createIpsettlement,
  deleteSettle,
  getIpsettlement,
  backToDept,
  hospitalpay,
  getPrintStatus,
  medicalSettle,
  updateSettleStatus,
  getDepositHistoryGroup
} from '@/rcm/store/hospital/hospital'
import {
  createFlow,
} from '@/rcm/store/inpatientSettlement/inpatientSettlement'
import commonReceiptPrint from '@/rcm/page/outpatientSettlement/common.receipt.printing'
import modifyRegInfo from '@/rcm/otmdiscomponent/modify-medical-reginfo.vue'
import { jljhCode, sysqzyyCode, gdcfybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import refundOriginal from '@/rcm/page/pay/originalroadrefund.vue'
import dialogmedicalinfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'
import { costSettlement, costDelete } from '@/rcm/store/otmdiscomponent/gd.localhost.api.js'
const emptyTpl = {
  settlementCouponDet: [],
  settlementMemberDet: [],
  settlementBenefitDet: [],
  settlementPromotion: []
}
export default {
  components: {
    chargeDetail,
    giftCardList,
    feeList,
    dialogbenefit,
    dialoginverse,
    refundOriginal,
    modifyRegInfo,
    dialogmedicalinfo
  },
  mixins: [commonReceiptPrint],
  props: ['paramsObj'],
  data () {
    return {
      useType: 'settle',
      tabloading: false,
      DefaultPayMethodDialogVisible: false,
      PayMethodTwoDialogVisible: false,
      dialogBenefitVisible1: false,
      obj: {
        benfitArr: {
          // 储值卡
          userCardArr: [],
          // 活动
          activeArr: [],
          // 优惠券
          giftCardArr: [],
          // 身份卡
          benefitCardArr: []
        },
        /** 优惠信息字段 */
        medFundFee: 0,
        memberCardPayedFee: 0,
        memberCardBenefitFee: 0,
        medPersonCountFee: 0,
        medFee: 0,
        comInsurancePayedFee: 0,
        comInsuranceFee: 0,
        comInsuranceBenefitFee: 0,
        totalFee: 0,
        promotionFee: 0,
        benefitCardFee: 0,
        giftCardFee: 0,
        totalDeposit: 0,
        refundFee: 0,
        receivableFee: 0,
        // 结算需要的信息
        berth: '',
        inpatientNumber: '',
        // 患者科室
        ipDept: '',
        ipNo: '',
        doctorId: '',
        ipSettleStatus: -1,
        ipStatus: 0,
        settleCode: '',
        settlementId: '',
        // 支付类数据
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: 2,
        // 1.住院押金，2出院计算
        FeeType: 2,
        // 总额
        // 已收金额
        receivedFee: '',
        exefee: '',
        unexefee: '',
        // 还需支付
        unReceivedFee: '',
        // 会员卡余额,暂时写死，后期在接口字段中返回
        MembershipCardBalance: 2000,
        isValited: true,
        medicalNo: '', // 选择全自费可以填写医保卡号然后进行医保报销
        // 结算单id
        id: '',
        patientId: '',
        paymethodArr: [],
        loading: false,
        payObj: {
          paymethod: 1,
          remark: '',
          flowfee: 0,
          auth_code: ''
        },
        payTradeLog: [],
        pendingOrderFee: '',
        ipSettlementDetail: [],
        // 卡券字段
        cardStatus: '',
        // 身份卡优惠券活动
        benefitCardStatus: true,
        giftCardStatus: true,
        memberCardStatus: true,
        activeCardStatus: true,
        giftCardLength: 0,
        benefitCardLength: 0,
        memberCardLength: 0,
        activeCardLength: 0,
        details: {
          ipSettlementDetail: [],
          ...JSON.parse(JSON.stringify(emptyTpl))
        },
      },
      printStatus: {},
      medicalRegisterInfo: false,
      medicalSettleBtn: false,
      // 吉林蛟河是否默认使用个人账户支付
      isMedicalPay: true,
      // 原路退费的参数
      refundOriginParams: {
        paymethodArr: [],
        // 先保证，是部分退费
        partialRefund: true,
        unexefee: 0,
        refundMethod: '0'
      },
      // 原路退费弹窗
      refunddialogVisible: false,
      hasCard: true,
      gdcfybCode
    }
  },
  watch: {
    'obj.settlementId': {
      handler: function (val, oldval) {
        if (val) {
          this.getSettleInfo()
        }
      }
    },
    // 支付弹窗直接关闭，刷新其他信息
    'PayMethodTwoDialogVisible': {
      handler: function (val) {
        if (!val) {
          this.getSettleInfo()
          this.$refs.chargedetail.list() // 刷新费用信息
          this.$emit('refresh')
        }
      }
    }
  },
  methods: {
    async listenPay () {
      this.DefaultPayMethodDialogVisible = false
      await this.getSettleInfo()
      // 如果是费用结算，则支付完成后再打印
      if (Number(this.obj.ipSettleStatus) === 3) {
        this.createPrint(1)
      }
    },
    async getSettleInfo () {
      this.tabloading = true
      try {
        let data = await getIpsettlement({ id: this.obj.settlementId })
        if (data && data.data) {
          // 删除掉，应为它不一定是正确的
          if (data.data.hasOwnProperty('ipStatus')) delete data.data.ipStatus
          if (data.data.hasOwnProperty('ipSettleStatus')) delete data.data.ipSettleStatus
          // 先把原来的details保存，否则会丢
          Object.assign(data.data.details, JSON.parse(JSON.stringify(emptyTpl))) // 清空优
          this.obj = Object.assign(this.obj, data.data)
          this.obj.exefee = this.obj.receivedFee
          this.obj.unexefee = this.obj.unReceivedFee
          this.obj.isRefund = this.obj.refundFlag
          // console.log(data.data)
          this.benefitDialogArr(
            data.data.details.ipSettleBenefitcard,
            data.data.details.ipSettlementDetail
          )
          this.benefitDialogArr(
            data.data.details.ipSettleMembercard,
            data.data.details.ipSettlementDetail
          )
          this.benefitDialogArr(
            data.data.details.ipSettleGiftcard,
            data.data.details.ipSettlementDetail
          )
          this.benefitDialogArr(
            data.data.details.ipSettlePromotion,
            data.data.details.ipSettlementDetail
          )
          this.obj.payObj.flowfee = data.data.unReceivedFee
          this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, ipSettleStatus: this.obj.ipSettleStatus }
          })
          this.getPrintStatus() // 获取结算单发票打印状态
        }
        this.tabloading = false
      } catch (err) {
        this.tabloading = false
      }
    },
    getPrintStatus () {
      getPrintStatus({ settlementId: this.obj.settlementId }).then(res => {
        this.printStatus = res.data
      })
    },
    benefitDialogArr (gArr, listArr) {
      // console.log('gArr', gArr)
      gArr.forEach(function (item) {
        item.showArr = []
        if (item.detailId) {
          item.detailId.forEach(function (k) {
            listArr.forEach(function (v) {
              if (k.trim() === v.id.trim()) {
                item.showArr.push(v)
              }
            })
          })
        }
      })
    },
    // 从详情获取数据
    getFromChild (data) {
      this.obj.details.ipSettlementDetail = data.ipSettlementDetail
      this.obj = Object.assign({}, this.obj, data.info)
    },
    async print (ipNo, settlementId) {
      let params = { ipNo: ipNo, loginid: localStorage.USERID }
      everprint('hospitalFeeList', params, { preview: true })
    },
    async settlePrint (settlementId) {
      everprint('rcm_hospital_billinner', { id: settlementId }, { preview: true })
    },
    createPrint (btnType = 1) {
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: this.getPrintStatus, // 发票打印成功之后刷新打印状态
        billPrintCall: this.settlePrint.bind(this, this.obj.settlementId), // 没有关联模版走老票据打印的回调
        code: 'rcm_hospital_bill', // 模版code
        everPrintParams: null,
        settlementId: this.obj.settlementId, // settlementid
        printType: 3, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      this.receiptPrint(info) // 调的mixin里面的公共票据打印接口
    },
    // 支付
    async payBtn () {
      // 0是新建状态，调用接口将结算单变成代付款状态,6是医保结算之后的状态
      if (this.obj.ipSettleStatus === 0 || this.obj.ipSettleStatus === 6) {
        let params = { id: this.obj.settlementId }
        let result = await hospitalpay(params)
        // 重新调接口处理预授权问题
        await this.getSettleInfo()
        if (result.data) {
          // 有费用为0或者使用卡券的患者，从待结算直接变成已付款的，且待付为0设置为不弹窗的，都不弹
          if ((result.data.ipSettleStatus === 3) && Number(this.obj.params.zero_pay_page)) {
            this.$messageTips(this, 'success', '支付成功', ' ')
            return false
          }
          // 正向支付仅用第二种支付方式，退费方式支持原路退和自定义退
          if (this.obj.isRefund) {
            // 原路退
            // 获取原结算单支付方式集合
            let params = { patientId: this.obj.patientId, ipNo: this.obj.ipNo }
            getDepositHistoryGroup(params).then(res => {
              this.refundOriginParams.paymethodArr = res.data
              this.refundOriginParams.unexefee = this.obj.unexefee
              this.refundOriginParams.refundMethod = this.obj.refundMethod
              this.refunddialogVisible = true
            }).catch((err) => {
              console.log('err', err)
            })
          } else {
            // 医保的相关金额显示
            this.obj.medInsurPubPayFee = this.obj.medFundFee
            this.obj.medInsurOwnPayFee = this.obj.medPersonCountFee
            this.PayMethodTwoDialogVisible = true
          }
        }
      } else if (this.obj.ipSettleStatus === 1) { // 如果是代付款，直接弹窗付款即可
        // if (this.obj.payParams.hos_pay_mode === '1') {
        //   this.DefaultPayMethodDialogVisible = true
        // } else {
        // 医保的相关金额显示
        this.obj.medInsurPubPayFee = this.obj.medFundFee
        this.obj.medInsurOwnPayFee = this.obj.medPersonCountFee
        this.PayMethodTwoDialogVisible = true
        // }
      }
    },
    // 中途结算
    halfSettle () {
      // 前面正常,后面
      let depositBalance = this.paramsObj.depositBalance
      if (depositBalance < 0) {
        this.$alert(
          '住院费用余额不足，请补交押金后再进行中途结算！',
          '支付',
          {
            confirmButtonText: '确定'
          }
        )
      } else {
        this.settleBtn(false)
      }
    },
    settleFn (isFinal) {
      if (this.paramsObj.insuranceOrgId && this.paramsObj.insuranceOrgId === this.gdcfybCode && !this.paramsObj.insuranceType) { // insuranceType为0时才是医保结算
        this.feeCheck(isFinal)
      } else {
        this.settleBtn(isFinal)
      }
    },
    feeCheck (isFinal) {
      this.tabloading = true
      let params = {
        patientId: this.obj.patientId, // 患者id
        settlementType: isFinal ? 1 : 2, // 0,押金，1处方,2是中途结算
        ipNo: this.obj.ipNo, // 住院号
        inpatientNumber: this.obj.inpatientNumber, // 病案号,
        insuranceType: this.paramsObj.insuranceType, // 2自费，1商保，0自费
        details: {
          ipSettleBenefitcard: [],
          ipSettleGiftcard: [],
          ipSettleMembercard: [],
          ipSettlePromotion: []
        }
      }
      costSettlement(params).then(rs => {
        if (!rs.head.errCode) {
          if (!rs.data.status) {
            this.cfReUpload(rs.data.message)
          } else {
            if (this.$route.path.indexOf('settlementPay') > -1) {
              // 如果当前页面是settlementPay/detail，结算后跳转到结算单查询页签的详情去
              const { query } = this.$route
              this.$router.push({
                path: '/adt/hospitalSettle/settlementQuery/detail',
                query
              })
            } else {
              const json = rs.data.rtData
              // 删除掉，它不一定是正确的
              if (json.hasOwnProperty('ipStatus')) delete json.ipStatus
              if (json.hasOwnProperty('ipSettleStatus')) delete json.ipSettleStatus
              // 先把原来的details保存，否则会丢
              Object.assign(json.details, JSON.parse(JSON.stringify(emptyTpl))) // 清空优惠活动等
              Object.assign(this.obj, json)
              this.obj.settlementId = json.id
            }
            this.$refs.chargedetail.list() // 刷新费用信息
            this.$refs.giftCardList && this.$refs.giftCardList.refreshBenefitList() // 刷新活动的列表
            this.refresh()
            this.tabloading = false
          }
        } else {
          this.tabloading = false
        }
      }, rj => {
        this.tabloading = false
      })
    },
    cfReUpload (msg) {
      this.$alert(msg, '提示', {
        confirmButtonText: '重新上传',
        callback: action => {
          this.$bus.$emit('gdcf:handlePreSettle')
        }
      })
    },
    // 出院结算
    async settleBtn (isFinal) {
      this.tabloading = true
      try {
        if (this.obj.details.settlementMemberDet && this.obj.details.settlementMemberDet.length > 0) {
          this.obj.details.settlementMemberDet[0].name = this.obj.details.settlementMemberDet[0].memberCardBatch.name
          this.obj.details.settlementMemberDet[0].begin_date = this.obj.details.settlementMemberDet[0].startDate
          this.obj.details.settlementMemberDet[0].cardId = this.obj.details.settlementMemberDet[0].id
        }
        if (this.obj.details.settlementBenefitDet && this.obj.details.settlementBenefitDet.length > 0) {
          this.obj.details.settlementBenefitDet[0].benefitId = this.obj.details.settlementBenefitDet[0].id
        }
        if (this.obj.details.settlementCouponDet && this.obj.details.settlementCouponDet.length > 0) {
          this.obj.details.settlementCouponDet[0].type = this.obj.details.settlementCouponDet[0].giftBatch.type
          this.obj.details.settlementCouponDet[0].name = this.obj.details.settlementCouponDet[0].giftBatch.name
        }
        let params = {
          patientId: this.obj.patientId, // 患者id
          settlementType: isFinal ? 1 : 2, // 0,押金，1处方,2是中途结算
          ipNo: this.obj.ipNo, // 住院号
          inpatientNumber: this.obj.inpatientNumber, // 病案号,
          insuranceType: this.paramsObj.insuranceType, // 2自费，1商保，0自费
          macId: this.macId, // 加传macId将未结算的费用上传医保
          details: {
            ipSettleBenefitcard: this.obj.details.settlementBenefitDet,
            ipSettleGiftcard: this.obj.details.settlementCouponDet,
            ipSettleMembercard: this.obj.details.settlementMemberDet,
            ipSettlePromotion: this.obj.details.settlementPromotion// 活动
          }
        }
        let settleMethod = isFinal ? createIpsettlement : halfSettle
        let data = await settleMethod(params)
        if (data && data.data) {
          if (!isFinal) {
            this.$messageTips(this, 'success', '中途结算成功，可进入结算记录进行查看！')
          } else if (this.$route.path.indexOf('settlementPay') > -1) {
            // 如果当前页面是settlementPay/detail，结算后跳转到结算单查询页签的详情去
            const { query } = this.$route
            this.$router.push({
              path: '/adt/hospitalSettle/settlementQuery/detail',
              query
            })
          } else {
            // 删除掉，它不一定是正确的
            if (data.data.hasOwnProperty('ipStatus')) delete data.data.ipStatus
            if (data.data.hasOwnProperty('ipSettleStatus')) delete data.data.ipSettleStatus
            // 先把原来的details保存，否则会丢
            Object.assign(data.data.details, JSON.parse(JSON.stringify(emptyTpl))) // 清空优惠活动等
            Object.assign(this.obj, data.data)
            this.obj.settlementId = data.data.id
          }
          this.$refs.chargedetail.list() // 刷新费用信息
          this.$refs.giftCardList && this.$refs.giftCardList.refreshBenefitList() // 刷新活动的列表
          this.refresh()
        }
        this.tabloading = false
      } catch (err) {
        // console.log(err)
        this.tabloading = false
      }
    },
    delFn (isFinal) {
      if (this.paramsObj.insuranceOrgId && this.paramsObj.insuranceOrgId === this.gdcfybCode) {
        let params = {
          id: this.obj.settlementId
        }
        costDelete(params).then(rs => {
          if (!rs.head.errCode) {
            if (this.$route.path.indexOf('settlementQuery') > -1) {
              // 如果当前页面是settlementQuery/detail，删除结算后跳转到结算页签的详情去
              this.$router.push({
                path: '/adt/hospitalSettle/settlementQuery'
              })
            } else {
              this.tabloading = false
              this.$refs.chargedetail.list()
              this.refresh()
              this.obj.receivableFee = 0
              this.obj.totalFee = 0
            }
            this.$messageTips(this, 'success', '删除结算成功')
          } else {
            this.$messageTips(this, 'error', '删除结算失败')
          }
        })
      } else {
        this.delBtn(isFinal)
      }
    },
    // 删除结算
    async delBtn () {
      // 已完成支付的单子需要让患者选择是否召回退补金额
      if (this.obj.ipSettleStatus === 3) {
        this.$confirm('该结算单已完成支付，是否召回退补金额?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          closeOnClickModal: false, // 禁止点背景时关闭
          closeOnPressEscape: false, // 禁止按esc关闭确认框
          showClose: false,
          callback: action => { this.doDelSettle(action) }
        })
      } else {
        // 其他的，直接按不召回退补金额删除结算单
        this.doDelSettle('cancel')
      }
    },
    // 真正执行删除结算操作,增加recallDepositBack是否将已结算金额回滚参数
    async doDelSettle (action) {
      this.tabloading = true
      let params = { id: this.obj.settlementId, macId: this.macId, recallDepositBack: action === 'cancel' ? 0 : 1 }
      try {
        let data = await deleteSettle(params)
        if (data && data.head.errCode === 0) {
          if (this.$route.path.indexOf('settlementQuery') > -1) {
            // 如果当前页面是settlementQuery/detail，删除结算后跳转到结算页签的详情去
            this.$router.push({
              path: '/adt/hospitalSettle/settlementQuery'
            })
          } else {
            this.tabloading = false
            this.$refs.chargedetail.list()
            this.refresh()
            this.obj.receivableFee = 0
            this.obj.totalFee = 0
          }
          this.$messageTips(this, 'success', '删除结算成功')
        } else {
          this.tabloading = false
        }
      } catch (err) {
        this.tabloading = false
      }
    },
    // 出科backToDept
    async outofBtn () {
      this.tabloading = true
      try {
        let data = await backToDept({ ipNo: this.obj.ipNo })
        if (data && data.head.errCode === 0) {
          this.tabloading = false
          // 退科改变状态触发刷新详情
          // this.$refs.chargedetail.list(-2)
          this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, ipStatus: 3 }
          })
        } else {
          this.tabloading = false
        }
      } catch (err) {
        this.tabloading = false
      }
    },
    afterpay () {
      this.closePaymethodtwo()
      this.createPrint(1)
    },
    closePaymethodtwo () {
      this.PayMethodTwoDialogVisible = false
    },
    refresh () {
      this.$emit('refresh')
    },
    // check是否可以支付
    checkPay (obj) {
      if (Number(obj.insuranceType) !== 0) { // 没用医保
        return obj.settlementId && obj.ipSettleStatus !== 3 && obj.ipStatus === 8
      } else { // 用了医保之后，得等医保结算之后才能出院支付
        return obj.settlementId && obj.ipSettleStatus === 6 && obj.ipStatus === 8
      }
    },
    // check删除结算
    checkDeleteSettle (obj) {
      // 现在为了方便医保的召回，只要有出院结算单，不管结算单状态如何都可以删除
      if (Number(obj.insuranceType) !== 0) {
        return obj.settlementId
      } else {
        return obj.settlementId
      }
    },
    // 医保出院登记
    medicalRegOut () {
      this.obj.tradeType = '0'
      this.obj.insuranceOrgId = this.paramsObj.insuranceOrgId
      this.medicalRegisterInfo = true
    },
    // 三亚医保结算前要先读一下卡
    handleHasCard (hasCard) {
      this.hasCard = hasCard
      this.readCard()
    },
    readCard () {
      this.$nextTick(_ => {
        this.$refs.medicalinfo.start()
      })
    },
    // 读完卡的回调，现在啥也不用干
    getMedDetailsEvent () { },
    // 医保结算
    medicalSettle () {
      this.medicalSettleBtn = true
      let params = {
        id: this.obj.id,
        macId: this.macId,
        // 使用个人账户，交互页面checkbox为true,得给医保传0，反之一样
        isMedicalPay: +!this.isMedicalPay
      }
      medicalSettle(params).then(res => {
        this.medicalSettleBtn = false
        this.$messageTips(this, 'success', '操作成功')
        // 刷新费用信息
        this.getSettleInfo()
        this.$refs.chargedetail.list() // 刷新费用信息
        this.$emit('refresh')
      }, err => {
        this.medicalSettleBtn = false
        console.log('err', err)
      })
    },
    // 医保出院登记后的刷新
    afterMedRegOut () {
      this.updateSettleStatus(() => {
        this.getSettleInfo()
        this.$refs.chargedetail.list() // 刷新费用信息
        this.$emit('refresh')
      })
    },
    // 出院结算的原路退费
    handleRefund ({ feeList }) {
      let params = {
        patientId: this.obj.patientId,
        ipNo: this.obj.ipNo,
        // 结算id
        settlementId: this.obj.id,
        // 结算单号
        settlementNo: this.obj.settleCode,
        type: this.obj.payType,
        feeList: feeList,
        refundTag: this.obj.isRefund,
      }
      createFlow(params).then(res => {
        this.refunddialogVisible = false
        this.$messageTips(this, 'success', '操作成功')
        this.$refs.chargedetail.list() // 刷新费用信息
        this.$emit('refresh')
      }).catch((err) => {
        console.log('err', err)
      })
    },
    // 将结算状态更新为医保出院登记
    updateSettleStatus (callback) {
      let params = { id: this.obj.id, status: 5 }
      updateSettleStatus(params).then(res => {
        callback.call(this)
      }, err => {
        console.log('err', err)
      })
    },
    // 三亚医保显示读卡
    showReadCard () {
      return this.obj.insuranceType === 0 && this.obj.ipSettleStatus === 5 && this.paramsObj.insuranceOrgId === sysqzyyCode
    },
    // 蛟河医保展示是否选择个人账户支付
    checkShowCheck () {
      return this.paramsObj.insuranceOrgId === jljhCode && this.obj.insuranceType === 0 && this.obj.ipSettleStatus === 5
    }
  }
}
</script>
<style scoped>
.jiantou {
  font-size: 12px;
}
.settle_btngroup {
  margin-left: -10px;
  width: calc(100vw - 65px);
  padding: 10px;
  position: absolute;
  bottom: 15px;
  background: #fff;
  z-index: 20;
}
.settle_btngroup .btnright {
  float: right;
  margin-left: 10px;
}
.settle_totalFee,
.settle_needpay {
  float: right;
  font-size: 14px;
  color: #000;
  font-weight: 400;
  line-height: 43px;
  height: 38px;
  vertical-align: bottom;
}
.settle_totalFee span {
  font-size: 18px;
  color: #ee4433;
  font-weight: 500;
  text-align: right;
  margin-right: 10px;
}
.settle_needpay span {
  font-size: 24px;
  font-weight: 500;
  line-height: 38px;
  display: inline-block;
  text-align: right;
  margin-right: 10px;
}
.settle_title {
  margin-top: 10px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  font-size: 14px;
  font-weight: bold;
}
.settle_title .btntext {
  padding: 0;
}
.chargedetailContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  padding: 0;
}
.chargedetailContainer .besideBtns {
  overflow-y: auto;
  margin-bottom: 75px;
}
</style>
