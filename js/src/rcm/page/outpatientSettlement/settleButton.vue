<!--
 * @Author: renpengfei
 * @Date: 2019-08-12 11:21:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-09-24 16:53:09
-->
<template>
  <div class="settleBtn">
    <!--part-return: 部分退条件 -->
    <fee-orders-dialog
      :dialog-show.sync="istrans"
      :base-info="baseInfo"
      :has-tpl="false"
      :fees-type="6"
      :part-return="(data) => data.orderItemStatus === 1"
      workspace="MZSF-001"
    ></fee-orders-dialog>
    <!-- 只有待结算页面才显示补费 -->
    <div class="makeup" v-if="!obj.id && obj.settleStatus == 0">
      <el-button type="primary" size="small" :disabled="!obj.patientid" @click="makeupfee">补费</el-button>
    </div>
    <!-- 医保医疗类别的显示 -->
    <medicalType
      v-if="settleStatus===1&&urlpath==0"
      v-model="medicalType"
      :insuranceOrgId="insuranceOrgId"
    ></medicalType>
    <div class="btnsright" :class="{recollect:obj.recollect}">
      <template v-if="!obj.writeOff">
        <el-button
          @click="listoffeePrint"
          v-if="$hasPermission('Auth_rcm_settlements_listoffeePrint')"
        >费用清单打印</el-button>
        <el-button
          @click="handlePreviousClick"
          v-if="previousButton.includes(settleStatus) && $route.query.settlementid && lastStep(obj)"
          :disabled="obj.loading"
        >上一步</el-button>
        <el-button
          @click="readCard(false)"
          v-if="settleStatus===1&&urlpath==0&&!afterReadCard&&insuranceOrgId!==hljybCode"
          :disabled="(obj.multipleSelection.length > 0&&!obj.loading) ? false : true"
        >读卡</el-button>
        <el-button
          @click="getMedicalFee()"
          type="primary"
          v-if="settleStatus===1&&urlpath==0&&!afterReadCard&&insuranceOrgId === sdllCode"
          :disabled="(obj.multipleSelection.length > 0&&!obj.loading) ? false : true"
        >预结算</el-button>
        <el-button
          @click="sdllpay()"
          v-if="settleStatus===1&&urlpath==0&&!afterReadCard&&insuranceOrgId === sdllCode"
          :disabled="(obj.multipleSelection.length > 0&&!obj.loading) ? false : true"
        >结算</el-button>
        <el-popover v-if="settleStatus===1&&urlpath==0&&!afterReadCard&&insuranceOrgId===hljybCode" placement="top-start" trigger="hover">
          <template slot="default">
            <el-button type="primary" size="mini" @click="cardType(0)">读卡</el-button>
            <el-button type="primary" size="mini" @click="cardType(7)">电子凭证</el-button>
          </template>
          <template slot="reference">
            <slot>
              <el-button class="leftbtn" size="small">读卡</el-button>
            </slot>
          </template>
        </el-popover>
        <el-button
          type="primary"
          v-if="afterReadCard&&obj.settleStatus==1"
          @click="medicalSettle"
        >确认</el-button>
        <el-button
          @click="comfirmzeropay(false)"
          v-if="settlebtn"
          :disabled="(obj.multipleSelection.length > 0&&!obj.loading) ? false : true"
        >结算</el-button>
        <!-- 当前步骤是医保，且状态在预警里面 -->
        <el-button
          v-if="obj.settleStatus==1&&obj.warningStatus>=0"
          @click="hljPreWarningSettle"
        >预警预分解</el-button>
        <!-- 正常的收费单子 -->
        <el-button
          type="primary"
          @click="beforePay"
          v-if="(settleStatus == 0 || settleStatus == 3)&&!obj.recollect&&!obj.returnFlag"
          :disabled="obj.multipleSelection.length > 0&&!obj.loading ? false : true"
        >支付</el-button>
        <el-button
          type="primary"
          @click="refundPay"
          v-if="(settleStatus == 0 || settleStatus == 3)&&(obj.recollect || obj.returnFlag)"
          :disabled="obj.multipleSelection.length > 0&&!obj.loading&&(this.obj.sourceSettlement.payedfee-this.obj.unFee<0)"
        >退款</el-button>
        <el-button
          @click="sdllPrintPdf"
          v-if="settleStatus == 4 && $hasPermission('sdll-settlement-print')"
        >结算单打印</el-button>
        <el-button
          @click="createPrint(1,false)"
          v-if="(settleStatus == 4 || settleStatus == 6) && obj.requestType === 0 && obj.requestType !== 4 && obj.returnFlag==false"
        >收据打印</el-button>
        <el-button
          @click="settleDetailPrint"
          v-if="(settleStatus == 4 || settleStatus == 6)"
        >打印费用明细</el-button>
        <el-button
          @click="createPrint(2,false)"
          v-if="!isHcjk && ((settleStatus == 4 || settleStatus == 6) && obj.allowPrintAgain && obj.requestType !== 0 && obj.requestType !== 4 && obj.returnFlag==false)"
        >收据重打</el-button>
        <el-button
          @click="createPrint(3,false)"
          v-if="!isHcjk && ((settleStatus == 4 || settleStatus == 6) && obj.allowPrintNew && obj.requestType !== 0 && obj.returnFlag==false)"
        >收据补打</el-button>
        <el-button
          plain
          @click="findInvoiceByIds({ id: obj.id })"
          v-if="isJinShui && obj.settleStatus == 4 && isHcjk"
        >国税发票</el-button>
        <!-- sob发起退费 -->
        <el-button
          @click="handleBillrefund"
          v-if="settleStatus == 5 && obj.mergedReceiptData.length > 0"
          :disabled="obj.loading || obj.multipleSelection.length<=0"
        >确认退费</el-button>
      </template>
    </div>
    <div class="settle_needpay">
      <div v-if="obj.recollect" :class="{recollect:obj.recollect}">
        <b>原单总金额：</b>
        <span>¥{{ obj.sourceSettlement.totalFee | formatToFinacial }}</span>
        <template
          v-if="obj.sourceSettlement.comInsuranceDirectFee +
          obj.sourceSettlement.majorAccountFee !=0"
        >
          <b>原单报销金额：</b>
          <span>
            ¥{{
            floatTool.add(
            obj.sourceSettlement.comInsuranceDirectFee,
            obj.sourceSettlement.majorAccountFee
            ) | formatToFinacial
            }}
          </span>
        </template>

        <b>原单优惠金额：</b>
        <span>
          ¥{{
          obj.sourceSettlement.totalBenefit | formatToFinacial
          }}
        </span>
        <b>原单预收核销：</b>
        <span>
          ¥{{
          obj.sourceSettlement.medSetFee | formatToFinacial
          }}
        </span>
        <b>原单应付金额：</b>
        <span class="cRed">
          ¥{{
          obj.sourceSettlement.payedfee | formatToFinacial
          }}
        </span>
      </div>
      <div :class="{recollect:obj.recollect}">
        <b>医保统筹：</b>
        <span>{{obj.medInsurPubPayFee | formatToFinacial}}</span>
        <b>医保账户：</b>
        <span>{{obj.medInsurOwnPayFee | formatToFinacial}}</span>
        <b>{{ obj.recollect ? "重收" : null }}总金额：</b>
        <span>¥{{ obj.totalFee | formatToFinacial }}</span>
        <template v-if="urlpath!=1">
          <b>{{ obj.recollect ? "重收" : null }}报销金额：</b>
          <span v-if="settleStatus===1&&urlpath==0&&!afterReadCard&&insuranceOrgId!==hljybCode&&insuranceOrgId === sdllCode">
            ¥{{ obj.ybfdje| formatToFinacial }}
          </span>
          <span v-else>
            ¥{{
            floatTool.add(obj.comInsuranceDirectFee, obj.majorAccountFee)
            | formatToFinacial
            }}
          </span>
          <b>{{ obj.recollect ? "重收" : null }}优惠金额：</b>
          <span>
            ¥{{
            obj.totalBenefit | formatToFinacial
            }}
          </span>
          <b>{{ obj.recollect ? "重收" : null }}预收核销：</b>
          <span>
            ¥{{
            obj.medSetFee | formatToFinacial
            }}
          </span>
        </template>
        <b>{{ obj.recollect ? "重收" : null }}{{obj.returnFlag?'应退':'应付'}}金额：</b>
        <!-- 乐陵只有读过卡之后才展示医保金额，否则展示门诊结算单金额 -->
        <span class="cRed" v-if="settleStatus===1&&urlpath==0&&!afterReadCard&&insuranceOrgId === sdllCode && hasSdllCardInfo">
          ¥{{ obj.receivable| formatToFinacial }}
        </span>
        <span v-else class="cRed">
          ¥{{(obj.recollect?(obj.payedfee+obj.memberCardFee):obj.unFee) | formatToFinacial }}
        </span>
      </div>
      <div v-if="obj.recollect" :class="{recollect:obj.recollect}">
        <b>应退总金额：</b>
        <span>
          ¥{{
          floatTool.subtract(obj.sourceSettlement.totalFee, obj.totalFee)
          | formatToFinacial
          }}
        </span>
        <b>应冲报销金额：</b>
        <span>
          ¥{{
          floatTool.subtract(
          floatTool.add(
          obj.sourceSettlement.comInsuranceDirectFee,
          obj.sourceSettlement.majorAccountFee
          ),
          floatTool.add(obj.comInsuranceDirectFee, obj.majorAccountFee)
          ) | formatToFinacial
          }}
        </span>
        <b>应冲优惠金额：</b>
        <span>
          ¥{{
          floatTool.subtract(
          obj.sourceSettlement.totalBenefit,
          obj.totalBenefit
          ) | formatToFinacial
          }}
        </span>
        <b>应冲预收核销：</b>
        <span>
          ¥{{
          floatTool.subtract(
          obj.sourceSettlement.medSetFee,
          obj.medSetFee
          ) | formatToFinacial
          }}
        </span>
        <b>应退金额：</b>
        <span class="cRed">
          ¥{{
          floatTool.subtract(
          obj.sourceSettlement.payedfee,
          (obj.payedfee+obj.memberCardFee)
          ) | formatToFinacial
          }}
        </span>
      </div>
    </div>
    <!-- 支付2 -->
    <paymethodstwo
      v-if="paydialogVisible"
      :dialogVisible.sync="paydialogVisible"
      :obj="newpayobj"
      @cancel="cancel"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
      @closedialog="closedialog"
    ></paymethodstwo>
    <!-- 支付1 -->
    <settle-pay-ment-layer
      :obj="newpayobj"
      v-if="layershow"
      :layershow.sync="layershow"
      @getData="getData"
      @closedialog="closedialog"
      @paymentSuccess="paymentSuccess"
      ref="settlepaymentlayer"
    ></settle-pay-ment-layer>
    <!-- 原路退款 -->
    <originalroadrefund
      v-if="refunddialogVisible"
      :refunddialogVisible.sync="refunddialogVisible"
      :paramsObj="refundOriginParams"
      @sureRefund="sureRefund"
    ></originalroadrefund>
    <!-- 医保卡读卡信息弹窗 -->
    <dialogmedicalinfo
      :insuranceOrgId="insuranceOrgId"
      @getMedDetails="getMedDetailsEvent"
      :cardTypeInfo="cardTypeInfo"
      :scence="1"
      ref="medicalinfo"
    ></dialogmedicalinfo>
    <!-- 授权弹窗 -->
    <authorize-log
      ref="authorizelog"
      @confirmCallback="authorizeconfirm"
      :callbackVal="callbackVal"
      :typeCode="typeCode"
      :callbackValue="callbackValue"
      :visitNumber="visitNumber"
      :patientId="patientId"
      :authSettlementid="authSettlementid"
    ></authorize-log>
    <!-- 医保慢病弹窗 -->
    <specialDis
      :specialDis.sync="specialDis"
      :tableData="specialDisList"
      :insuranceOrgId="insuranceOrgId"
      @confirm="specialDisSure"
      :cardParams="obj.personInfo"
    ></specialDis>
    <el-dialog :visible="refundResult.visible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="30%" append-to-body>
      <div style="height: 100px; line-height: 80px;text-align: center;">
        {{refundResult.message}}
      </div>
      <div style="text-align: center;">
        <el-button v-if="refundResult.type === 1">{{refundResult.timeVal}} s后查询结果</el-button>
        <el-button v-if="refundResult.type === 2" type="primary" @click="getRefundStatus">查询结果</el-button>
      </div>
    </el-dialog>
    <!-- 乐陵打印结算单pdf -->
    <printpdf v-show="false" ref="printpdf"></printpdf>
  </div>
</template>
<script>
import printpdf from '@/rcm/page/outpatientSettlement/printpdf/printpdf.vue'
import { singleConfig, previousButton } from './settleconfig'
import refunddialog from '@/rcm/page/outpatientSettlement/refunddialog.vue'
import originalroadrefund from '@/rcm/page/pay/originalroadrefund'
import dialogmedicalinfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'
import {
  settleCreate,
  previousSettle,
  getPrint,
  billrefundOrigin,
  confirmRefund,
  refundSettle,
  phyDelete,
  getInsuranceIdByVisitNumber,
  getRefundStatus
} from '@/rcm/store/outpatient/outpatient'
import { floatTool } from '@/util/common'
import { everprint } from '@/util/print.js'
import invoice from '@/rcm/page/invoicemanage/invoice'
import settlePayMentLayer from '@/rcm/page/pay/settlepaymentlayer'
import commonReceiptPrinting from '@/rcm/page/outpatientSettlement/common.receipt.printing'
import AuthorizeLog from './authorize.log'
import authApi from '@/rcm/store/outpatient/auth.manage.api.js'
import api from '@/rcm/store/settlementapi.js' // 未引入改api文件，导致getMedicalFee方法调用api接口报错
// CPOE 补费组件
import FeeOrdersDialog from '@/inpatient/components/fee.orders/fee.dialog'
// 医保公共的医保类型
import medicalType from '@/rcm/otmdiscomponent/medicalType.vue'
// 医保公共的慢病弹窗
import specialDis from '@/rcm/otmdiscomponent/specialdisease.vue'
import { hljybCode, jljhCode, sdllCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
// 黑龙江医保相关的方法通过mixin混入
import hljSettlebutton from '@/rcm/otmdiscomponent/hljmedical/hlj-settlebutton.js'
import jljhSettlebutton from '@/rcm/otmdiscomponent/jljhmedical/jljh-settlebutton.js'
import authorizeInfo from '@/rcm/page/outpatientSettlement/authorizeinfo.js'
import { changeReadType } from '@/rcm/store/otmdiscomponent/insurancesignin.js'
export default {
  mixins: [invoice, commonReceiptPrinting, hljSettlebutton, jljhSettlebutton],
  props: {
    settleStatus: {
      type: Number,
      default: 0
    },
    obj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    AuthorizeLog,
    FeeOrdersDialog,
    settlePayMentLayer,
    refunddialog,
    originalroadrefund,
    dialogmedicalinfo,
    medicalType, // 医疗类别总弹窗
    specialDis, // 黑龙江慢病弹窗
    printpdf // 乐陵打印结算单pdf
  },
  data () {
    return {
      callbackVal: '', // 回调函数的函数名字
      callbackValue: '', // 回调函数的传参
      authorizeInfo: authorizeInfo,
      authSettlementid: null, // 授权弹窗如果是在结算页是免单进入的支付页面，此时已经有的结算单id，需要把该参数传给授权接口
      typeCode: '',
      visitNumber: this.$route.query.visitNumber,
      patientId: this.$route.query.patientId,
      showconfirmbtn: true,
      dialogmedicalinfovisible: false,
      urlpath: this.$route.meta && this.$route.meta.status,
      singleConfig: singleConfig,
      previousButton: previousButton,
      istrans: false,
      tableData: [],
      floatTool: floatTool,
      paydialogVisible: false,
      layershow: false,
      refunddialogVisible: false,
      newpayobj: {
        recollect: this.obj.recollect,
        refundReceiptFlows: [],
        paystatusobj: {
          settlementid: '',
          returnFlag: 0
        },
        writeOffId: '',
        exefee: 0,
        iscallback: true,
        payObj: {
          paymethod: '1',
          remark: '',
          flowfee: '',
          auth_code: '', // 授权码
          qrfee: '' // pos机的金额
        },
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        payType: '1',
        // 结算单id
        id: '',
        loading: false,
        // 总金额
        totalFee: 0,
        totalBenefit: 0,
        unFee: 0,
        unexefee: 0,
        settleCode: '',
        payTradeLog: [] // 支付记录
      },
      // 原路退费的对象
      refundOriginParams: {
        id: '',
        partialRefund: false,
        recollect: false,
        paymethodArr: [],
        wipeOffFee: 0,
        unexefee: 0,
        refundMethod: '0'
      },
      printInfo: { id: '', code: '' },
      insuranceOrgId: this.$route.query.insuranceOrgId, // 医保读卡组件需要的医保机构ID
      clinicType: false,
      isHcjk: false,
      hljybCode, // 黑龙江医保的code标识
      jljhCode, // 蛟河医保code标识
      specialDis: false,
      afterReadCard: false,
      medicalType: '11', // 医疗类别,默认是普通门诊
      specialDisList: [], // 慢病的列表
      refundResult: {
        visible: false,
        message: '退费已经发起，请等待退款结果',
        type: 2,
        timeVal: 3,
        time: null
      },
      cardTypeInfo: {
        type: ''
      },
      isQR: false,
      sdllMedicalobj: null,
      hasSdllCardInfo: false, // 乐陵医保读卡的金额数据是否已经返回，如果已经返回则展示医保金额
      sdllCode
    }
  },
  mounted () {
    this.isHcjk = this.$ever.getClinicConfig().clinicType === 'hcjk'
    // 获取授权列表
    this.getAuthList()
  },
  watch: {
    // 补费框关闭时，重新获取数据
    istrans () {
      if (!this.istrans) this.refundStatus()
    },
    '$store.state.pending': function (num) {
      // 防止点击补费操作的时候，不执行loading
      if (this.istrans) return
      if (num > 0) {
        if (this.layershow) return
        this.obj.loading = true
      }
      if (num === 0) {
        this.obj.loading = false
      }
    },
    '$route.meta': {
      handler: function (val, oldval) {
        this.urlpath = val && val.status
      },
      immediate: true
    },
    'isRefund': {
      handler: function (val) {
        if (val) {
          this.getRefundStatus()
        }
      }
    },
    'settleStatus': {
      handler: function (val) {
        // 如果当前状态是医保，就先通过流水号获取医保机构id，因为乐陵医保的医保项目编码要单独显示，其他的医保不需要
        if (val === 1) {
          this.getInsuranceIdByVisitNumber()
        }
      }
    }
  },
  computed: {
    // 补费组件需要参数
    baseInfo () {
      const {
        rootorderid: visitNumber,
        orderDoctor: doctorId,
        patientid: patientId,
        patientName,
        orderDept: providerId,
        orderDeptName: providerName,
        doctorName
      } = this.obj && this.obj.master || {}
      return ({
        visitNumber,
        doctorId,
        patientId,
        patientName,
        providerId,
        providerName,
        feesDoctor: {
          id: doctorId,
          name: doctorName
        }
      })
    },
    isRefund () {
      return (this.settleStatus === 0 || this.settleStatus === 3) && (this.obj.recollect || this.obj.returnFlag)
    },
    settlebtn: function () {
      if (this.singleConfig.includes(this.settleStatus)) {
        // 医保账单显示读卡按钮，结算单显示结算按钮
        if (this.settleStatus === 1) {
          if (Number(this.urlpath) === 0) {
            // 读卡
            return false
          } else {
            // 兼顾黑龙江预警结算
            return this.obj.warningStatus === undefined || this.obj.warningStatus < 0
          }
        } else if (this.settleStatus === 2) {
          return this.$hasPermission('Auth_menu_rcm_settlements_claimAdjuster')
        } else if (this.settleStatus === 7) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  methods: {
    // 山东乐陵打印pdf
    sdllPrintPdf () {
      this.$nextTick(() => {
        this.$refs.printpdf.getPdf(this.obj.id)
      })
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
    // 慢病选择之后
    specialDisSure (val) {
      this.medicalOperation('SpecialDisSure', val)
    },
    // 不同医保机构转发不同执行函数
    medicalOperation (operate, val) {
      let method = this[orgList[this.insuranceOrgId]['code'] + operate]
      if (typeof method === 'function') {
        method.call(this, val)
      }
    },
    // 待遇信息确认带着读卡信息生成结算单
    getMedDetailsEvent (medicalobj) {
      if (Object.keys(medicalobj).length > 0) {
        this.obj.personInfo = medicalobj
        if (medicalobj.personname !== this.obj.patientName) {
          this.$messageTips(this, 'error', '医保卡信息与当前患者姓名不一致，不能进行医保结算')
          return false
        }
        if (this.insuranceOrgId === this.hljybCode) {
          /** 黑龙江医保的额外参数开始 */
          this.obj.personInfo.icCardPassword = medicalobj.password
          this.obj.personInfo.icCard = medicalobj.icCard
          this.obj.personInfo.hljMedicalType = this.medicalType
          /** 黑龙江医保的额外参数结束 */
          // 调慢病查询接口
          this.getHljSpecialDisList()
        } else if (this.insuranceOrgId === this.jljhCode) {
          this.obj.personInfo.medicalType = this.medicalType
          this.getJljhSpecialDisList()
        } else if (this.insuranceOrgId === this.sdllCode) { // 乐陵读卡后不进行任何操作，在点击支付的时候才进行预结算
          this.sdllMedicalobj = medicalobj
          this.getMedicalFee()
          this.$messageTips(this, 'success', '读卡成功')
        } else {
          this.handleSettleClick(false)
        }
      } else {
        this.$messageTips(this, 'error', '没有读取到医保卡信息，请放置好医保卡重新读取')
        return false
      }
    },
    getMedicalFee () {
      if (!this.sdllMedicalobj) {
        this.$messageTips(this, 'error', '请先读卡')
        return
      }
      let params = this.initCreateParams()
      api.medicalFee(params).then(rs => {
        if (!rs.head.errCode) {
          this.obj.medInsurPubPayFee = rs.data.tczf
          this.obj.medInsurOwnPayFee = rs.data.grzhzf
          this.obj.totalFee = rs.data.zje
          this.obj.ybfdje = rs.data.ybfdje
          this.obj.receivable = rs.data.receivable
          this.hasSdllCardInfo = true
        }
      })
    },
    sdllpay () {
      if (!this.sdllMedicalobj) {
        this.$messageTips(this, 'error', '请先读卡')
        return
      }
      this.handleSettleClick(false)
    },
    // 医保分解
    medicalSettle () {
      this.medicalOperation('MedicalSettle')
    },
    getInsuranceIdByVisitNumber (cb) {
      // 机构id接口获取
      let params = {
        visitNumber: this.$route.query.visitNumber
      }
      getInsuranceIdByVisitNumber(params).then(res => {
        if (!res.data) {
          cb && this.$messageTips(this, 'error', '未获取到医保机构id,请稍后再试！')
          return false
        } else {
          this.insuranceOrgId = res.data
          this.obj.insuranceOrgId = this.insuranceOrgId
          cb && cb.call(this)
        }
      }).catch(err => {
        console.log('err', err)
      })
    },
    cardType (type) {
      this.cardTypeInfo.type = type
      this.readCard(type === 7)
      changeReadType({ type: type }).then(rs => { })
    },
    readCard (isQR) {
      var _this = this
      this.isQR = isQR || false
      function showCard () {
        if (_this.insuranceOrgId === _this.hljybCode) {
          // 黑龙江医保每次读卡先把医疗类别的项处理成默认值，即普通门诊
          _this.medicalType = '11'
        }
        _this.$nextTick(_ => {
          _this.$refs.medicalinfo.start(_this.isQR)
        })
      }
      if (this.insuranceOrgId) {
        // 如果有值，直接盗用读卡组件
        showCard()
      } else {
        // 如果没有，重新再尝试读一下
        this.getInsuranceIdByVisitNumber(showCard)
      }
    },
    // 从已结算列表过来的统一退费入口
    refundPay () {
      this.billrefundOriginRoad(this.obj)
    },
    getRefundStatus (type) { // 只有2种情况会调这个接口，rcm退费成功后的回调函数 或者 刷新页面后判断当前是退款状态
      const params = {
        id: this.$route.query.settlementid || this.obj.id
      }
      getRefundStatus(params).then(rs => {
        if (!rs.head.errCode) { // online退款是否有支付宝或者微信，payState当前退款的状态 4退款中，6退款成功
          if (rs.data.online) { // 有微信或者支付宝
            if (rs.data.payState === 4) { // 有微信或者支付宝，并且当前是转入退款状态
              if (!this.refundResult.visible) { // 退款等待弹窗没有打开的话
                this.refundResult.type = 1
                this.refundResult.visible = true
                this.refundResultLogTime()
                return
              }
            } else if (rs.data.payState === 6) {
              this.refundResult.visible = false
              this.paysuccess()
              this.$emit('getSettleStatus')
            }
          } else {
            if (type) { // 如果没有微信和支付宝，并且是从支付成功过来的，则说明退款成功，需要跳转到已结算页签
              this.paysuccess()
              this.$emit('getSettleStatus')
            }
          }
        }
      })
    },
    refundResultLogTime () {
      this.refundResult.time = window.setInterval(_ => {
        this.refundResult.timeVal--
        if (this.refundResult.timeVal < 0) {
          window.clearInterval(this.refundResult.time)
          this.refundResult.time = null
          this.refundResult.type = 2
        }
      }, 1000)
    },
    handleBillrefund () {
      if (Number(this.urlpath) === 1) { // 待退费页签
        this.billrefund()
      } else { // 已退费页签
        // 其他情况的退费
        this.normalRefund()
      }
    },
    normalRefund () {
      this.billrefundOriginRoad(this.obj)
    },
    // 待退费页签的退费
    async billrefund () {
      let multipleSelection = JSON.parse(
        JSON.stringify(this.obj.multipleSelection)
      )
      multipleSelection.map(item => {
        item.recipeDetails.map(v => {
          v.discount = floatTool.divide(v.discount, 100)
        })
      })
      try {
        let params = {
          patientid: this.$route.query.patientId, // 患者id
          rootorderid: this.$route.query.visitNumber, // 患者visitNumber
          mergedReceiptData: multipleSelection,
          macId: this.macId
        }
        let data = await refundSettle(params)
        if (data.data.reSettleId) {
          this.$router.push({
            path: '/rcm/reconstruct/settled',
            query: {
              settlementid: data.data.reSettleId,
              visitNumber: this.$route.query.visitNumber,
              dptId: this.$route.query.dptId,
              patientId: this.$route.query.patientId
            }
          })
        } else {
          Object.assign(this.obj, data.data)
          this.obj.paystatusobj.returnFlag = 1
          this.obj.isRefund = true
          this.newpayobj = Object.assign(this.newpayobj, this.obj)
          this.billrefundOriginRoad(data.data)
        }
      } catch (err) { }
    },
    // 待退费的页签的原路退
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
        refundFlowList: feeList,
        macId: this.macId
      }
      confirmRefund(params).then(res => {
        this.$messageTips(this, 'success', '操作成功')
        this.refunddialogVisible = false
        this.getRefundStatus(true)
      }).catch((err) => {
        console.log('err', err)
      })
    },
    // 上一步
    async handlePreviousClick () {
      try {
        let params = {
          id: this.$route.query.settlementid
        }
        let data = await previousSettle(params)
        if (data.settlementId) {
          this.obj.id = data.settlementId
          this.$emit('getSettleStatus')
        } else {
          this.$router.push({
            path: '/rcm/reconstruct/peddingsettlement',
            query: {
              visitNumber: this.$route.query.visitNumber,
              dptId: this.$route.query.dptId,
              patientId: this.$route.query.patientId
            }
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    comfirmzeropay (ispay) {
      if (Number(this.obj.parameters.zero_pay_page) === 1) { // 0元支付不保留支付页
        if (Number(this.obj.unFee) === 0) { // 0元支付不保留支付页面，并且选择商保后支付金额是0元，就不回再跳到支付按钮
          this.$confirm('当前还需支付0元，点击确定直接支付完成！', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.callbackVal = 'handleSettleClick'
            this.callbackValue = ispay
            this.$refs.authorizelog.visible = true
            // this.handleSettleClick(ispay)
          }).catch(() => { })
        } else {
          this.handleSettleClick(ispay)
        }
      } else {
        this.handleSettleClick(ispay)
      }
    },
    initCreateParams () {
      // 商保
      let settlementComInsurDet = []
      if (this.obj.settlementComInsurDetID) {
        settlementComInsurDet = [
          {
            insurOrgId:
              (this.obj.settlementComInsurDetID &&
                this.obj.settlementComInsurDetID.insurerId) ||
              (this.obj.details &&
                this.obj.details.settlementComInsurDet &&
                this.obj.details.settlementComInsurDet[0] &&
                this.obj.details.settlementComInsurDet[0].insurOrgId),
            salePolicy:
              this.obj.settlementComInsurDetID &&
                this.obj.settlementComInsurDetID.salePolicy === 0
                ? '0'
                : '',
            insurProductId:
              this.obj.settlementComInsurDetID &&
              this.obj.settlementComInsurDetID.productId,
            patientid: this.$route.query.patientId
          }
        ]
      } else {
        settlementComInsurDet = []
      }
      let settlementMajorAccount = []
      if (this.obj.productId) {
        settlementMajorAccount = [
          {
            customerName:
              this.obj.productId && this.obj.productId.customerName, // 大客户名称
            productName: this.obj.productId && this.obj.productId.productName, // 报销方案名称
            reimburseRate:
              this.obj.productId && this.obj.productId.reimburseRate, // 报销比例
            customer: this.obj.productId && this.obj.productId.customer, // 大客户id
            productId: this.obj.productId && this.obj.productId.id // 报销方案id
          }
        ]
      } else {
        settlementMajorAccount = []
      }
      let settlementDetail = []
      if (this.obj.settleStatus === 0) {
        this.getDetail().map(item => {
          item.discount = floatTool.divide(item.discount, 100)
          settlementDetail.push(item)
        })
      } else {
        settlementDetail = this.getDetail()
      }
      let params = {
        // 医保信息
        medInsurOwnPayFee: this.obj.medInsurOwnPayFee, // 医保自费金额
        medInsurPubPayFee: this.obj.medInsurPubPayFee, // 医保报销金额
        // 商保信息
        comInsurance: settlementComInsurDet.length > 0, // 是否使用商保
        comInsuranceDirectFee: this.obj.comInsuranceDirectFee, // 商保报销金额
        insuranceTotalfee: this.obj.insuranceTotalfee, // 商保合计金额
        recRate: this.obj.recRate, // 商保报销比例,
        comInsuranceBenefit: this.obj.comInsuranceBenefit,
        comInsuranceBenefitFee: this.obj.comInsuranceBenefit
          ? this.obj.comInsuranceBenefitFee
          : 0,
        // 大客户信息
        majorAccountFee: this.obj.majorAccountFee, // 大客户报销金额
        majorTotalfee: this.obj.majorTotalfee, // 大客户总金额
        reimburseRate: this.obj.reimburseRate, // 大客户比例
        // 通用信息
        id: this.obj.id || '',
        settlecode: this.obj.settleCode || '',
        patientid: this.$route.query.patientId, // 患者id
        rootorderid: this.$route.query.visitNumber, // 患者visitNumber
        settleStatus: this.settleStatus, // 当前结算状态
        details: {
          settlementDetail: settlementDetail,
          settlementComInsurDet: settlementComInsurDet,
          settlementMajorAccount: settlementMajorAccount,
          settlementCouponDet: this.obj.details.settlementCouponDet,
          settlementMemberDet: this.obj.details.settlementMemberDet,
          settlementBenefitDet: this.obj.details.settlementBenefitDet,
          settlementPromotion: this.obj.details.settlementPromotion,
          medPersonInfo: this.obj.details.medPersonInfo
        },
        benefitFee: this.obj.benefitInfo.benefitFee,
        promotionFee: this.obj.benefitInfo.promotionFee,
        selfDiscountFee: this.obj.benefitInfo.selfDiscountFee,
        membergradecutfee: this.obj.benefitInfo.membergradecutfee,
        memberactcutfee: this.obj.benefitInfo.memberactcutfee,
        discounts: this.obj.discounts,
        personInfo: this.obj.personInfo || {}, // 医保患者信息
        // 蛟河是否默认使用个人账户支付，交互页面checkbox为true,得给医保传0，反之一样
        medicalPay: this.obj.personInfo.medicalPay
      }
      // 医保阶段要macId
      if (!params.personInfo.macId && this.obj.settleStatus === 1) {
        params.personInfo.macId = this.macId
      }
      if (this.insuranceOrgId === this.sdllCode && this.sdllMedicalobj && this.sdllMedicalobj.yltclb) { // 乐陵读卡后不进行任何操作，在点击支付的时候才进行预结算
        params.yltclb = this.sdllMedicalobj.yltclb
      }
      return params
    },
    // 如果是账单则需要跳页面结算单则刷新getprint
    async handleSettleClick (ispay) {
      try {
        let params = this.initCreateParams()
        let data = await settleCreate(params)
        // 账单待结算
        if (Number(this.urlpath) === 0) {
          if (ispay) {
            Object.assign(this.obj, data.settlement)
            this.newpayobj = this.obj
            return Promise.resolve(data)
          } else {
            this.$router.push({
              path: '/rcm/reconstruct/settled',
              query: {
                settlementid: data.settlement.id,
                showDetail: 0,
                visitNumber: data.settlement.rootorderid,
                dptId: data.settlement.orderDept,
                patientId: data.settlement.patientid,
                time: Date.now()
              }
            })
          }
          // 账单待退费
        } else if (Number(this.urlpath) === 1) {
          // 结算单
        } else if (Number(this.urlpath) === 2) {
          if (ispay) {
            Object.assign(this.obj, data.settlement)
            this.newpayobj = this.obj
            return Promise.resolve(data)
          } else {
            this.$emit('getSettleStatus')
          }
        }
      } catch (err) {
        console.log(err)
        return Promise.reject()
      }
    },
    getDetail () {
      let newmultipleSelection = JSON.parse(
        JSON.stringify(this.obj.multipleSelection)
      )
      let settlementDetail = newmultipleSelection.reduce((total, cur) => {
        total = [...total, ...cur.recipeDetails]
        return total
      }, [])
      return settlementDetail
    },
    // 补费
    makeupfee () {
      this.istrans = !this.istrans
    },
    // 套餐支付完成后，点击遮罩的回调
    getpackStatus () {
      this.obj.tcloading.close()
      document.onclick = null
      this.$emit('packageAfterPay')
    },
    // 支付前需判断是否存在未支付套餐，如果有引用关系的未支付套餐，需更改折扣
    beforePay () {
      // 只有商业保险和大客户才会有免单按钮，并且显示大按钮是结算按钮
      // promotionId活动 memberCardId储值卡 benefitCardId身份卡 giftcardIds.length>0优惠券
      // mergedReceiptData.recipeDetails[0].mealFlag 是否套餐
      // mergedReceiptData.recipeDetails[0].discount === 100
      let ishasPackage = this.getDetail().some(
        v => v.mealPaidFlag === 2 && v.mealFlag
      )
      if (ishasPackage) {
        this.$alert(
          '存在未支付的套餐，请先支付套餐或者使用自费支付(将套餐勾选框勾掉)！',
          '支付',
          {
            confirmButtonText: '确定'
          }
        )
      } else {
        this.judgeAuthorize()
      }
    },
    judgeAuthorize () {
      let lock = false
      let typeCode = []
      this.authorizeInfo.forEach(item => {
        if (item.code === 'sbin_free_auth' && item.status) { // 商保免单授权
          if (this.obj.comInsuranceBenefit) { // 并且结算单选中了免单
            lock = true
            typeCode.push('sbin_free_auth')
            this.authSettlementid = this.$route.query.settlementid
          }
        } else if (item.code === 'discount_auth' && item.status) { // 折扣授权
          let benefit = this.obj.benefitInfo
          // promotionId活动 memberCardId储值卡 benefitCardId身份卡 giftcardIds.length>0优惠券
          if (!benefit.promotionId && !benefit.memberCardId && !benefit.benefitCardId && benefit.giftcardIds.length === 0) { // 营销优惠带来的折扣的改变不需要进行授权
            this.obj.mergedReceiptData.forEach(lab => {
              lab.recipeDetails.forEach(v => {
                if (!v.freeSheet && v.discount !== 100) { // freeSheet是否是cope开的免单项目，是的话不需要授权
                  lock = true
                  typeCode.push('discount_auth')
                }
              })
            })
          }
        } else if (item.code === 'meal_sett_auth' && item.status) { // 套餐结算
          this.obj.mergedReceiptData.forEach(lab => {
            lab.recipeDetails.forEach(v => {
              if (v.mealFlag) {
                lock = true
                typeCode.push('meal_sett_auth')
              }
            })
          })
        }
      })
      if (lock) {
        this.callbackVal = 'handlePayClick'
        this.typeCode = [...new Set(typeCode)].join(',')
        this.$refs.authorizelog.visible = true
      } else {
        this.handlePayClick()
      }
    },
    // 支付环节0元支付处理
    async payzero (paymode) {
      if (Number(this.obj.parameters.zero_pay_page) === 1) {
        if (Number(this.obj.unFee) === 0) {
          this.$confirm('当前还需支付0元，点击确定直接支付完成！', '提示', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              let data = await this.handleSettleClick(true)
              if (Number(this.obj.unFee) === 0) {
                this.$router.push(
                  {
                    path: '/rcm/reconstruct/settled',
                    query: {
                      settlementid: data.settlement.id,
                      showDetail: 0,
                      visitNumber: data.settlement.rootorderid,
                      dptId: data.settlement.orderDept,
                      patientId: data.settlement.patientid,
                      time: Date.now()
                    }
                  }
                  // v => {
                  //   this.$emit('getSettleStatus')
                  // }
                )
              } else {
                paymode === '1'
                  ? (this.layershow = true)
                  : (this.paydialogVisible = true)
              }
            })
            .catch(() => { })
        } else {
          await this.handleSettleClick(true)
          paymode === '1'
            ? (this.layershow = true)
            : (this.paydialogVisible = true)
        }
      } else {
        await this.handleSettleClick(true)
        paymode === '1'
          ? (this.layershow = true)
          : (this.paydialogVisible = true)
      }
    },
    // 支付
    async handlePayClick () {
      let paymode = this.obj.parameters.pay_mode
      if (this.obj.isRefund) {
        this.obj.isRefund = false
      }
      if (this.obj.settleStatus === 0) {
        this.payzero(paymode)
      } else if (this.obj.settleStatus === 3) {
        this.newpayobj = this.obj
        // 作废场景不需要更新结算单
        paymode === '1'
          ? (this.layershow = true)
          : (this.paydialogVisible = true)
      }
    },
    // 关闭弹窗
    cancel () {
      this.paydialogVisible = false
    },
    paysuccess (showDetail = 0) {
      // let path = this.$route.meta && this.$route.meta.status
      this.$router.push({
        path: '/rcm/reconstruct/settled',
        query: {
          settlementid: this.newpayobj.id,
          showDetail: showDetail,
          visitNumber: this.$route.query.visitNumber,
          dptId: this.$route.query.dptId,
          patientId: this.$route.query.patientId,
          time: Date.now()
        }
      })
    },
    // 支付2成功回掉
    payStatus () {
      if (!this.newpayobj.isRefund) { // 退费的不打印
        this.createPrint(1, true) // 心和堂要求支付完成自动调打印
        this.paysuccess()
      } else {
        this.getRefundStatus()
      }
    },
    // 关闭前回调
    async closedialog (done) {
      try {
        if (Number(this.urlpath) === 0) {
          if (this.obj.id && this.obj.settleStatus === 3) {
            this.paysuccess()
          }
        } else if (this.settleStatus === 4) {
          let params = {
            id: this.newpayobj.id
          }
          await phyDelete(params)
        }
        done()
      } catch (err) {
        done()
      }
    },
    // 支付1成功回掉
    getData (isFinish, type) {
      if (isFinish) {
        this.layershow = false
        // 退费的不打印,第二个参数是标识直接关闭弹窗的也不打印
        if (!this.newpayobj.isRefund && !type) {
          this.createPrint(1, true) // 心和堂要求支付完成后，自动调打印
        }
        // 如果整笔结算单没有支付完成，不关弹窗，也先不跳转20191214
        // 原来的逻辑是paysuccess在isFinish外面，导致线上支付第一笔之后，会立刻跳转，然后组件初始化，弹窗给关了
        this.paysuccess()
      } else {
        this.$messageTips(this, 'success', '支付成功')
        this.$emit('getSettleStatus')
      }
    },
    // 作废成功回掉
    refundStatus () {
      this.$emit('getSettleStatus')
    },
    // 支付弹窗支付成功的回调
    paymentSuccess () { },
    // 费用清单打印
    listoffeePrint () {
      if (this.$route.query.settlementid) {
        everprint('mzfyqd_afterComInsur', { settlementId: this.$route.query.settlementid }, {
          preview: true
        })
      } else { // 切换到新模板了
        everprint('mzfyqd', { visitNumber: this.$route.query.visitNumber }, { preview: true })
      }
    },
    billPrintCall () {
      everprint('rcm-outpatient-bill', { id: (this.$route.query.settlementid || this.obj.id), patientId: this.$route.query.patientId }, { preview: true })
    },
    printSuccessCall () {
      let params = {
        id: this.$route.query.settlementid || this.obj.id,
        forPrint: true
      }
      getPrint(params).then(rs => {
        Object.assign(this.obj, rs.data)
      })
    },
    // 支付后打印目前存在问题
    /*
    @isAuto，标识是否支付完成后自动打印的
    */
    createPrint (btnType = 1, isAuto) {
      if (this.isHcjk) {
        if (isAuto) {
          // 海创支付完成之后，不要自动打印
          return
        } else { // 海床打印
          everprint('thc_rcm_FEIYONGQINGDAN_LNN_20181114', { id: this.$route.query.settlementid || this.obj.id }, { preview: true })
        }
      }
      let info = {
        isPrintSuccess: true, // 是否需要默认的打印回调
        printSuccessCall: this.printSuccessCall, // 打印成功的回调
        billPrintCall: this.billPrintCall, // 没有关联模版走老票据打印的回调
        code: 'rcm_dishui', // 模版code
        everPrintParams: null,
        settlementId: this.$route.query.settlementid || this.obj.id, // settlementid
        printType: 2, // 打印类型 1：挂号打印、2:门诊打印 3:住院打印
        btnType: btnType // 按钮类型 1打印 2重打 3补打
      }
      this.receiptPrint(info)
    },
    // 打印费用明细
    settleDetailPrint () {
      everprint('outpatientFeeList', { id: this.obj.id, patientId: this.$route.query.patientId }, { preview: true })
    },
    lastStep (obj) { // 查找上一步结算节点
      let settledStatusArr = obj.patientIdentity.filter(item => item.status === 1)
      let length = settledStatusArr.length
      if (length > 0 && settledStatusArr[length - 1].sort === 1) { // 如果上一步是医保，则上一步就不展示
        return false
      }
      return true
    },
    // 授权的回调函数
    authorizeconfirm (callVal) {
      this[callVal.callbackVal](callVal.value)
    }
  },
}
</script>

<style lang="less" scoped>
.settleBtn {
  position: absolute;
  bottom: 0;
  border-top: 1px solid #eeeeee;
  width: 100%;
  background: #fff;
  left: 0px;
  z-index: 1000;
  padding: 0 10px;
  box-sizing: border-box;
  /deep/ .el-dialog__wrapper {
    z-index: 200000000;
  }
}
.settleBtn .makeup {
  float: left;
  line-height: 36px;
  padding: 10px 0;
}
.settleBtn .btnsright {
  float: right;
}
.settleBtn .btnsright .el-button {
  margin: 10px 0;
}
.settleBtn .btnsright.recollect .el-button {
  margin: 26px 0;
}
.settleBtn .btnsright .el-button + .el-button {
  margin-left: 6px;
}
.trans {
  transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.settle_needpay {
  float: right;
  /* line-height: 56px; */
  /* height: 56px; */
  color: #000;
  font-size: 14px;
  text-align: right;
  margin-right: 20px;
}
.settle_needpay div {
  line-height: 56px;
}
.settle_needpay .recollect {
  line-height: 26px;
}
.settle_needpay span {
  font-size: 16px;
  display: inline-block;
  margin-right: 6px;
  font-weight: 500;
}
.settle_needpay span:last-child {
  font-size: 20px;
}
.settle_needpay b {
  font-weight: 400;
  display: inline-block;
}
</style>
