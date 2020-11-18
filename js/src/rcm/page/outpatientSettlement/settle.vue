<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-10-30 12:11:05
 -->
<template>
  <div
    class="layout_inner flex_layout_full fdc"
    v-loading="obj.loading"
    :key="$route.query.patientId"
  >
    <div :class="{top:istop}">
      <div class="back" v-if="$route.query.settlementid">
        <i class="el-icon-arrow-left" @click="prevBack()">返回</i>
      </div>
      <h4 class="settle_title">账单信息</h4>
      <step
        :patientIdentity="obj.patientIdentity"
        :jumpStep="Number(obj.parameters.direct_pay)"
        :recollect="obj.recollect"
        :settleStatus.sync="obj.settleStatus"
        @getSettleStatus="getSettleStatus"
        :obj="obj"
        @sfee="sfee"
      ></step>
    </div>
    <!-- <div class="layout_inner flex_col_1_hidden"> -->
    <div
      class="layout_inner flex_col_1_hidden tablescroll"
      :class="{recollect:obj.recollect}"
      @scroll="containScroll"
      id="tablescroll"
    >
      <out-settle-table
        v-if="settleTableVisi"
        :key="time"
        :tableData="obj.mergedReceiptData"
        :multipleSelection.sync="obj.multipleSelection"
        :columns="columns"
        :obj="obj"
        ref="outSettleTable"
        @getSettleStatus="getSettleStatus"
      ></out-settle-table>
      <insurance
        :patientIdentity="obj.patientIdentity"
        :settleStatus="obj.settleStatus"
        :obj="obj"
        :key="$route.query.patientId"
        ref="insurance"
      ></insurance>
      <benefit ref="benefit" v-if="checkShowBenefit()" :obj="obj"></benefit>
      <settle-button
        :settleStatus="obj.settleStatus"
        :obj="obj"
        @getSettleStatus="getSettleStatus"
        @packageAfterPay="handleRouterRange"
      ></settle-button>
      <tradelog
        v-if="obj.settleStatus==3||obj.settleStatus==4||obj.settleStatus ==6"
        :obj="obj"
        @refreshData="refreshData"
      ></tradelog>
    </div>
  </div>
</template>
<script>
import step from './step'
import insurance from './insurance'
import outSettleTable from './outSettleTable'
import benefit from './benefitcollection'
import settleButton from './settleButton'
import tradelog from './paytradelog'
import { getRefundAuthorize } from '@/rcm/store/outpatient/outpatient'
import { tableconfig, singleConfig, multiConfig } from './settleconfig.js'
import insurancePrice from './computeinsunance.js'
import watermark from 'watermark-dom'
import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
const watermarkConfig = {
  watermark_txt: '退费重收',  // 水印的内容
  watermark_color: '#000000',            // 水印字体颜色
  watermark_fontsize: '20px',          // 水印字体大小
  watermark_alpha: 0.2,               // 水印透明度，要求设置在大于等于0.005
  watermark_angle: 15,                 // 水印倾斜度数
  watermark_x: 350,                     // 水印起始位置x轴坐标
  watermark_y: 200,
  monitor: false // true不可删除，false可以删除
}
const watermarkResize = () => {
  watermark.load(watermarkConfig)
}
export default {
  mixins: [insurancePrice],
  components: {
    step,
    insurance,
    outSettleTable,
    benefit,
    tradelog,
    settleButton
  },
  props: {
    time: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      istop: false,
      tcloading: false,
      settleTableVisi: true,
      obj: {
        discounts: [],
        medInsurPubPayFee: 0,
        ybfdje: 0,
        medInsurOwnPayFee: 0,
        receivable: 0,
        refundReceiptFlows: [],
        sourceSettlement: {
          comInsuranceDirectFee: 0,
          majorAccountFee: 0,
          payedfee: 0,
          totalBenefit: 0,
          totalFee: 0
        },
        recollect: false,
        writeOff: false,
        writeOffId: '',
        freetmoney: 0,
        paystatusobj: {
          settlementid: '',
          returnFlag: 0
        },
        payedfee: 0,
        // 纯自费标识
        selfPay: false,
        exefee: 0,
        existPendingCharges: false,
        existPendingRefounds: false,
        iscallback: true,
        payObj: {
          paymethod: '2',
          remark: '',
          flowfee: '',
          auth_code: '',
          qrfee: '' // pos机的金额
        },
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: '1',
        // 结算单id
        id: '',
        settleStatus: 0,
        // 已勾选哪些
        multipleSelection: [],
        loading: false,
        // 取价数组
        getPriceJSON: [],
        // 参数配置
        parameters: {},
        // 免单金额
        comInsuranceBenefitFee: 0,
        // 免单标示
        comInsuranceBenefit: false,
        // 处方
        mergedReceiptData: [],
        // 商保报销金额
        comInsuranceDirectFee: 0,
        settlementComInsurDetID: '',
        insuranceTotalfee: 0,
        insurancegetTotalfee: 0,
        // 总金额
        totalFee: 0,
        totalBenefit: 0,
        medSetFee: 0,
        unFee: 0,
        recRate: 0,
        // 大客户报销金额
        majorAccountFee: 0,
        unpaidMealFlag: '',
        unPaidMealQuantity: 0,
        unPaidMeal: {},
        productId: '', // 报销方案id
        reimburseRate: '', // 报销比例
        majorTotalfee: 0,
        settleCode: '',
        // 营销方面的优惠
        benefitInfo: {
          patientId: this.$route.query.patientId,
          visitNumber: this.$route.query.visitNumber,
          deptId: this.$route.query.dptId,
          promotionId: '', // 活动id
          promotionFee: 0, // 活动优惠金额
          benefitCardId: '', // 身份卡id
          benefitFee: 0, // 身份卡优惠金额
          giftcardIds: [], // 优惠券id
          memberactcutfee: 0, // 优惠券优惠金额
          memberCardId: '', // 储值卡id
          membergradecutfee: 0, // 储值卡优惠金额
          selfDiscountFee: 0 // 自费金额
        },
        mergedSettleDetail: [],
        // 结算信息
        details: {
          settlementDetail: [],
          mediCatalog: [],
          medFeeitem: [],
          medPayInfo: [],
          settlementThirdOrgCard: [],
          settlementComInsurDet: [], // 商保
          settlementMemberDet: [], // 储值卡
          medPersonInfo: [],
          settlementBenefitDet: [], // 身份卡
          settlementCouponDet: [], // 优惠券
          settlementPromotion: [], // 活动优惠
          settlementMajorAccount: [] // 大客户信息
        },
        personInfo: {}, // 长春市医保患者信息
        // 保险信息
        patientIdentity: [],
        payTradeLog: [], // 支付记录
        insuranceOrgId: ''// 医保机构id
      }
    }
  },
  watch: {
    $route: {
      handler: function (val, oldval) {
        this.handleRouterRange()
      },
      immediate: true
    },
    'obj.recollect': {
      handler: function (val, oldval) {
        // 先取消水印
        if (val) {
          watermark.load(watermarkConfig)
          window.addEventListener('resize', watermarkResize)
        } else {
          var ele = document.getElementById('wm_div_id')
          ele && watermark.remove()
        }
      },
    }
  },
  beforeDestroy () {
    var ele = document.getElementById('wm_div_id')
    ele && watermark.remove()
    window.removeEventListener('resize', watermarkResize)
  },
  computed: {
    columns: function () {
      // 已结算的话根据结算顺序显示table
      // 未结算根据场景现实
      let tableconfigFilter = []
      // 单步状态，需要显示单列的过滤，状态医保1、商保2、大客户7
      if (singleConfig.indexOf(this.obj.settleStatus) > -1) {
        tableconfigFilter = tableconfig.filter(item => {
          if (item.index && item.index.indexOf(this.obj.settleStatus) > -1) {
            return item
          }
        })
      } else if (multiConfig.indexOf(this.obj.settleStatus) > -1) {
        // 单步状态，需要显示多列的过滤，状态自费结算0、代付款3、已付款4、待退费5、已退费6,这些状态下前面结算过的状态列都要显示
        let settledStatus = {}
        this.obj.patientIdentity.filter(item => item.status === 1).map(item => {
          settledStatus[item.sort] = true
        })
        tableconfigFilter = tableconfig.filter(item => {
          for (let i = 0; i < item.index.length; i++) {
            if (
              item.index.includes(this.obj.settleStatus) ||
              settledStatus[item.index[i]]
            ) {
              if (
                (item.hasOwnProperty('slotName') &&
                  item.slotName === 'useInsuranceDiscount') ||
                (item.hasOwnProperty('slotName') &&
                  item.slotName === 'majorAccountDiscount')
              ) {
              } else {
                return item
              }
            }
          }
        })
      }
      let insuranceOrgId = this.$route.query.insuranceOrgId
      if (insuranceOrgId === sdllCode) { // 只有是医保并且是乐陵医保才会显示项目编码列
        let code = {// 乐陵用的医保项目编码
          slotName: 'insuritemcode',
          index: [0, 3, 4, 5, 6, 1, 2, 7]
        }
        tableconfigFilter.splice(1, 0, code)
      }
      return tableconfigFilter
    }
  },
  methods: {
    // 监听滚动
    containScroll (e) {
      let scrollHeigeth = document.getElementById('tablescroll').scrollTop
      if (scrollHeigeth === 0) {
        this.istop = false
      } else {
        this.istop = true
      }
    },
    // 获取账单及商保，大客户，价格一系列接口
    async getBillApi (data) {
      try {
        await this.getDetail(data)
        await Promise.all([
          this.$refs.insurance.getInsuranceInfo(),
          this.$refs.insurance.getProgrammesByPatient()
        ])
        // 结算状态为商保状况下需拿到商保产品后取价
        await this.getinsPrice()
        let lock = await getRefundAuthorize('recommend_auth')
        if (this.obj.settleStatus === 0 && lock.data === '1') {
          await this.$refs.benefit.getBestBenefit() // 获取最优组合
        }
      } catch (err) {
      }
    },
    // 获取结算单，商保，大客户，价格一些列接口
    async getStatementsApi (data) {
      try {
        await this.getPrintDetail(data)
        await Promise.all([
          this.$refs.insurance.getInsuranceInfo(),
          this.$refs.insurance.getProgrammesByPatient()
        ])
        // 结算状态为商保状况下需拿到商保产品后取价
        await this.getinsPrice()
        let lock = await getRefundAuthorize('recommend_auth')
        if (this.obj.settleStatus === 0 && lock.data === '1') {
          await this.$refs.benefit.getBestBenefit() // 获取最优组合
        }
      } catch (err) {
      }
    },
    // 跳步骤时重新加载接口并给当前状态重新赋值
    async getSettleStatus (data) {
      // 有结算单id
      if (this.obj.id) {
        this.getStatementsApi(data) // 跳转结算单
      } else {
        this.getBillApi(data) // 跳转账单
      }
    },
    // 返回
    prevBack () {
      this.$router.push({
        path: '/rcm/reconstruct/settled',
        query: {
          showDetail: 1,
          visitNumber: this.$route.query.visitNumber,
          dptId: this.$route.query.dptId,
          patientId: this.$route.query.patientId
        }
      })
    },
    refreshData () {
      this.getStatementsApi()
    },
    sfee (fn) {
      this.computeBenefit(fn)
    },
    handleRouterRange () {
      this.obj.insuranceOrgId = '' // 切换患者的时候把该参数清空
      this.settleTableVisi = false
      this.$nextTick(_ => {
        this.settleTableVisi = true
        let query = this.$route.query
        if (query.settlementid) {
          this.getStatementsApi()
        } else if (query.patientId) {
          this.getBillApi()
        }
      })
    },
    emptyStep () {
      this.$refs.benefit.clearAllSelection()
    },
    // 是否可以展示优惠，活动等
    checkShowBenefit () {
      return this.obj.settleStatus === 0 && (!this.obj.recollect) && (!this.obj.writeOff) && !this.hasStatus(1) && !this.hasStatus(2) && !this.hasStatus(7)
    },
    // 判断用过哪些步骤，用来判断是否用改过医保，商保，大客户
    hasStatus (status) {
      return this.obj.patientIdentity.filter(v => v.sort === status && v.status === 1).length > 0
    }
  }
}
</script>
<style scoped>
.settle_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin: 3px 0 3px;
}
.hr {
  margin: 0;
}
.layout_inner .settle_title:last-child {
  margin-top: 10px;
}
.settleDetail {
  margin-top: 10px;
}
.back {
  padding-bottom: 15px;
}
.back .el-icon-arrow-left {
  padding: 5px;
  cursor: pointer;
}
.tablescroll {
  overflow-y: scroll;
  padding: 0;
  margin-top: 10px;
  margin-bottom: 50px;
}
.tablescroll.recollect {
  margin-bottom: 88px;
}
.top {
  box-shadow: 0 7px 9px -8px rgba(0, 0, 0, 0.3);
}
</style>

