<template>
  <el-dialog
    title="支付"
    :visible.sync="v"
    width="1000px"
    v-loading="payLoading"
    :modal-append-to-body="true"
    :append-to-body="true"
    class="paylayer"
    v-if="v"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div v-loading="payLoading">
      <div class="layout_inner settle_fee" style="margin-top: 20px;" v-if="obj.FeeType== 2">
        <el-row>
          <el-col :span="6">
            <span class="label_name">医嘱项目：</span>
            <span class="label_money">{{obj.FeeType== 1 ? '住院押金':'出院结算'}}</span>
          </el-col>
          <el-col :span="6">
            <span class="label_name">总额：</span>
            <span class="label_money">￥{{obj.totalFee| formatToFinacial}}</span>
          </el-col>
          <el-col :span="6">
            <template>
              <span class="label_name">已收金额：</span>
              <span class="label_money">￥{{obj.exefee| formatToFinacial}}</span>
            </template>
          </el-col>
          <el-col :span="6">
            <template>
              <span class="label_name">还需支付：</span>
              <span class="label_money_need">￥{{obj.unexefee| formatToFinacial}}</span>
            </template>
          </el-col>
        </el-row>
      </div>
      <div class="containerOut">
        <div :class="{paymethodContainer:true,paymethodContainerMoveLeft:moveLeft}">
          <div class="settle_paymethod">
            <div class="settlepaymentbox">
              <h4 class="settle_paymethod_title">支付选择</h4>
              <div class="paymethod_pay">
                <template v-for="item in obj.paymethodArr">
                  <div
                    class="paymethod_pay_item"
                    :class="{active: obj.payObj.paymethod === item.value,paymethod_pay_item_noicon:!(item.value in paymethodsHasIcon)}"
                    @click="selectmethod(item)"
                    :key="item.value"
                  >
                    <template v-if="item.value in paymethodsHasIcon">
                      <span>
                        <i class="iconfont" :class="paymethodsHasIcon[item.value]"></i>
                        {{item.name}}
                      </span>
                    </template>
                    <template v-else>{{item.name}}</template>
                    <i class="iconfont icon-Selected" v-show="obj.payObj.paymethod === item.value"></i>
                  </div>
                </template>
                <div
                  v-if="payChannel.length>0"
                  :class="{paymethod_pay_item:true,active:(obj.payObj.paymethod==3 || obj.payObj.paymethod==4)}"
                  @click="selectmethod(payChannel[0])"
                >
                  <span v-for="item in payChannel" :key="item.value">
                    <i class="iconfont" :class="paymethodsHasIcon[item.value]"></i>
                  </span>
                  <i
                    class="iconfont icon-Selected"
                    v-show="obj.payObj.paymethod ===3 || obj.payObj.paymethod ===4"
                  ></i>
                </div>
                <div class="paymethod_con" style="clear: both;" v-show="obj.payObj.paymethod === 0">
                  <div class="paymethod_con_money">
                    <el-row>
                      <el-col :span="6" class="payselect">
                        <el-select
                          v-model="selectvalue"
                          placeholder="请选择"
                          style="margin-left:10px;"
                          value-key="id"
                        >
                          <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item"
                          ></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="6" class="payinput">
                        <el-input
                          v-model="obj.payObj.flowfee"
                          :disabled="Boolean(obj.isRegister) || (Object.keys(selectvalue).length>0?false:true)"
                          @keyup.native="limitDecimal(obj.payObj.flowfee,obj.payObj.paymethod,'isClick')"
                          type="number"
                          @mousewheel.native="mousewheelevent"
                        ></el-input>
                      </el-col>
                      <el-col :span="8">
                        <div class="paymethodunitbehind">
                          <template v-if="usercardinfo.isShareCard">
                            <span>共享剩余金额:</span>
                            <span class="colorRed">{{usercardinfo.restShareMoney}}</span>
                          </template>
                          <span>余额:</span>
                          <span class="colorRed">{{usercardinfo.allmoney}}</span>
                          <span>（本金：{{usercardinfo.storedMoney}}，赠金：{{usercardinfo.givedMoney}}）</span>
                        </div>
                      </el-col>
                      <el-col :span="3">
                        <el-button
                          style="float: left;"
                          type="primary"
                          @click="pay"
                          :disabled="isSureLoading"
                        >{{btnText}}</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="paymethod_con" style="clear: both;" v-show="obj.payObj.paymethod !== 0">
                  <div
                    class="paymethod_con_money"
                    style="float: left;"
                    v-show="obj.payObj.paymethod === 9"
                  >
                    实收金额
                    <el-input
                      placeholder="请填写金额"
                      type="number"
                      v-model="obj.payObj.qrfee"
                      @keyup.native="limitDecimal(obj.payObj.flowfee,obj.payObj.paymethod,'isClick')"
                    ></el-input>
                  </div>
                  <div
                    class="paymethod_con_money"
                    style="float: left;"
                    v-show="obj.payObj.paymethod !== 9"
                  >
                    实收金额
                    <!-- 入院登记时，金额不让改 -->
                    <el-input
                      placeholder="请填写金额"
                      type="number"
                      :disabled="Boolean(obj.isRegister)"
                      @keyup.native="limitDecimal(obj.payObj.flowfee,obj.payObj.paymethod,'isClick')"
                      v-model="obj.payObj.flowfee"
                    ></el-input>
                  </div>
                  <div
                    class="paymethod_con_money"
                    style="float: left;"
                    v-if="obj.payObj.paymethod === 9"
                  >
                    授权码
                    <el-input
                      v-focus="obj.payObj.paymethod === 9"
                      placeholder="请扫码"
                      type="number"
                      v-model="obj.payObj.auth_code"
                    ></el-input>
                  </div>
                  <div class="paymethod_con_money" style="float: left;">
                    备注
                    <el-input placeholder="请填写备注" v-model="obj.payObj.remark"></el-input>
                  </div>
                  <el-button
                    style="float: left;"
                    type="primary"
                    @click="pay"
                    :disabled="isSureLoading"
                  >{{btnText}}</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="payCode" @click="preventAccidentClick">
            <div class="code">
              <qrcode :value="payUrl" :options="payOptions"></qrcode>
            </div>
            <div class="authCode">
              <input
                key="authCode"
                id="authCode"
                v-model="obj.payObj.auth_code"
                @change="handleScanCode"
              />
            </div>
            <div>
              金额：
              <span class="cRed">{{obj.payObj.flowfee}}</span>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  getPayment,
  createFlow,
  cancel,
  getIpSettlement,
} from '@/rcm/store/inpatientSettlement/inpatientSettlement'
import { Notification } from 'element-ui'
import storage from '@/util/storage'
import useraccountapi from '@/workspace/store/useraccountapi'
import settleapi from '@/rcm/store/settlepaymentapi'
import { floatTool } from '@/util/common'
// floatTool.add(a,b)相加 floatTool.subtract(a,b)相减 floatTool.multiply(a,b)相乘
// floatTool.divide(a,b)相除
export default {
  props: ['dialogVisible', 'obj'],
  data () {
    return {
      useraccountapi,
      payLoading: false,
      money: 0,
      payedList: [],
      isSureLoading: false,
      payChannel: [],
      options: [],
      type: 2,
      feeList: [],
      usercardinfo: {
        storedMoney: 0,
        givedMoney: 0,
        allmoney: 0,
        id: '',
        isShareCard: false
      },
      moveLeft: false,
      // 有icon的支付方式集中管理
      paymethodsHasIcon: {
        '0': 'icon-cash iconfont1',
        '1': 'icon-cash iconfont1',
        '2': 'icon-card iconfont2',
        '3': 'icon-alipay iconfont3',
        '4': 'icon-wechat iconfont4',
        '7': 'icon-cash iconfont1',
        '9': 'icon-QR iconfont9',
        '10': 'icon-card iconfont2',
        '11': 'icon-alipay iconfont4',
        '12': 'icon-alipay iconfont3',
        '16': '',
        '20': '',
        '21': ''
      },
      payUrl: '未能请求到二维码参数，暂时无法使用主扫支付',
      QRFlowNumber: '',
      payOptions: {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        rendererOpts: {
          quality: 0.3
        },
        width: 200
      },
      payCodeLoading: null,
      timer: null // 微信支付宝支付中轮询计时器
    }
  },
  directives: {
    focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.getElementsByTagName('input')[0].focus()
        }
      }
    }
  },
  created () {
    this.payList()
  },
  computed: {
    selectvalue: {
      get () {
        return this.usercardinfo
      },
      set (val) {
        this.usercardinfo = val
        if (Object.keys(val).length > 0) {
          this.usercardinfo.allmoney = floatTool.add(Number(val.storedMoney), Number(val.givedMoney))
        }
      }
    },
    v: {
      get () {
        return this.dialogVisible
      },
      set (val) {
        this.$emit('update:dialogVisible', val)
      }
    },
    btnText: {
      get () {
        if (this.obj.FeeType === 1) {
          if (this.obj.isRegister) {
            return '确认支付'
          } else {
            return '确认补缴'
          }
        } else if (this.obj.FeeType === 2) {
          if (this.obj.unexefee > 0) {
            return '确认支付'
          } else {
            return '确认退款'
          }
        }
      }
    }
  },
  watch: {
    dialogVisible: {
      handler: async function (val, oldval) {
        // 弹窗打开时，将上次的数据清零
        if (val) {
          this.usercardinfo.storedMoney = 0
          this.usercardinfo.givedMoney = 0
          this.usercardinfo.allmoney = 0
          this.usercardinfo.id = ''
          this.usercardinfo.isShareCard = false
          this.obj.payObj.remark = ''
          this.getcard()
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClose (done) {
      // 如果扫码支付中直接关闭支付弹窗了，扫码支付的相关都要清空
      this.resetPayContext()
      if (this.obj.iscallback) {
        this.$emit('closedialog', done)
      } else {
        this.v = false
      }
    },
    // 获取支付url
    getPayUrl () {
      let params = {
        patientId: this.obj.patientId,
        settlementId: this.obj.id,
        settlementNo: this.obj.settleCode,
        type: 2,
        feeList: [
          {
            payMethod: Number(this.obj.payObj.paymethod),
            flowFee: this.obj.payObj.flowfee,
            remark: this.obj.payObj.remark
          }
        ],
        source: 'QRCODE',
        authCode: this.obj.payObj.auth_code,
        clinicId: storage.getLocalStorage('CLINICID'),
        host: window.location.origin,
        // host: 'http://testsyzx.everjiankang.com.cn', // 测试阶段使用
        channel: 'unified_qr_in_order',
      }
      return new Promise((resolve, reject) => {
        settleapi.getQRCodeAddress(params).then(res => {
          if (res.data && res.data.success) { // 获取成功了
            this.payUrl = res.data.qrcode
            this.QRFlowNumber = res.data.flowNumber
            this.polling(res.data.flowNumber, undefined, 5000, (result) => {
              this.$emit('getdata', result)
            })
            resolve()
          } else { // 获取失败
            this.QRFlowNumber = ''
            this.isSureLoading = false
            this.$messageTips(this, 'error', res.data.message)
          }
        }).catch(err => {
          this.resetPayContext()
          console.log(err)
        })
      })
    },
    // 打开支付遮罩
    openPayLoading () {
      this.payCodeLoading = this.$loading({
        lock: true,
        text: '支付中请稍后。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
    },
    // 微信支付宝扫码支付
    toWechatOrAliPay (paymethod) {
      this.getPayUrl().then(_ => {
        this.moveLeft = !this.moveLeft
        setTimeout(_ => {
          this.obj.payObj.auth_code = ''
          let ele = document.getElementById('authCode')
          ele.focus()
        }, 1000)
      })
    },
    // 获取会员卡
    getcard () {
      useraccountapi
        .getRcmUserCard(this.obj.patientid || this.obj.patientId)
        .then(r => {
          if (r.head.errCode === 0) {
            if (r.data.length >= 0) {
              r.data.map(v => {
                if (v.memberCardShare) {
                  v.name = `${v.memberCardBatch.name}(共享卡)`
                  v.isShareCard = true
                  v.restShareMoney = v.memberCardShare.restShareMoney
                } else {
                  v.name = v.memberCardBatch.name
                  v.isShareCard = false
                  v.restShareMoney = 0
                }
              })
              this.selectvalue = r.data.length > 0 ? r.data[0] : {}
              this.options = r.data
            }
          }
        })
    },
    // 保留两位小数
    limitDecimal (fee, paymethod, isClick) {
      let action = [...this.actions()].filter(([key, value]) =>
        key.test(`${isClick}_${String(paymethod)}`)
      )
      action.forEach(([key, value]) => value.call(this, fee, paymethod))
    },
    // keyup金额逻辑
    actions (fee, paymethod) {
      // 非会员卡逻辑
      const clickevent = (fee, paymethod) => {
        /* do sth */
        if (/^[+-]?\d*\.?\d{0,2}$/.test(fee)) {
        } else {
          this.obj.payObj.flowfee = fee.substring(0, fee.length - 1)
        }
      }
      // 会员卡逻辑
      const cardevent = (fee, paymethod) => {
        clickevent(fee, paymethod)
        this.cardevent(fee, paymethod)
      }
      return new Map([
        [/^isClick_([1-9]|(1[0-9])|(2[0-9]))$/, clickevent],
        [/^isClick_[0]$/, cardevent]
      ])
    },
    // 会员卡逻辑
    cardevent (fee, paymethod) {
      let cardFee = this.obj.payObj.flowfee
      if (!this.obj.isRefund && !this.obj.isDeposit && cardFee > this.obj.unexefee) {
        cardFee = ''
        this.$messageTips(this, 'error', '会员卡支付金额不能大于还需支付')
        return
      }
      // 收费，(非共享卡会员卡)余额小于应收金额
      if (!this.obj.isRefund && !this.usercardinfo.isShareCard) {
        // 输入金额大于会员卡可用余额
        if (cardFee > this.usercardinfo.allmoney) {
          cardFee = ''
          this.$messageTips(this, 'error', '会员卡支付金额不能大于其可用金额')
          return
        }
      }
      // 共享卡
      if (!this.obj.isRefund && this.usercardinfo.isShareCard) {
        // 共享额度大于等于余额
        if (
          this.usercardinfo.restShareMoney >= this.usercardinfo.allmoney
        ) {
          // 金额不能超过共享额度
          if (cardFee > this.usercardinfo.allmoney) {
            cardFee = ''
            this.$messageTips(this, 'error', '会员卡支付金额不能大于其可用金额')
            return
          }
        } else {
          // 共享额度小于余额金额不能超过余额
          if (cardFee > this.usercardinfo.restShareMoney) {
            cardFee = ''
            this.$messageTips(this, 'error', '共享余额不足')
            return
          }
        }
      }
      return true
    },
    // 求和
    getsum (arr) {
      return arr
        .reduce((total, cur) => {
          if (cur.flowFee !== '') {
            total += Number(cur.flowFee)
          }
          return total
        }, 0)
        .toFixed(2)
    },
    // 金额计算
    getfee (arr, type) {
      let result = ''
      if (type === 'add') {
        result = (arr.reduce((total, cur) => {
          total += Number(cur)
          return total
        }, 0)).toFixed(2)
      } else {
        result = (arr.reduce((total, cur, index) => {
          if (index === 0) {
            total = Number(cur)
          } else {
            total -= Number(cur)
          }
          return total
        }, arr[0])).toFixed(2)
      }
      if (Number(result) === 0) {
        return ''
      } else {
        return Number(result)
      }
    },
    // 阻止默认事件
    mousewheelevent (event) {
      event = event || window.event; event.preventDefault()
    },
    // 支付方式获取
    async payList () {
      this.payLoading = true
      try {
        let params = {
          // 住院支付方式类型
          type: 2
        }
        let data = await getPayment(params)
        if (data && data.data) {
          let defaultPayMethods = data.data.default
          // 支付通道
          this.payChannel = []
          this.payChannel = defaultPayMethods.filter(v => (v.value === 3 || v.value === 4))
          // 其他支付方式
          let otherPayMethods = defaultPayMethods.filter(v => (v.value !== 3 && v.value !== 4))
          if (this.obj.isDeposit) {
            this.obj.paymethodArr = otherPayMethods.filter(v => (v.value !== 15))
          } else {
            this.obj.paymethodArr = otherPayMethods.filter(v => (v.value !== 14))
          }
          // 外面参数传进来参数默认为现金，将支付方式更改为设置的默认支付方式
          let defaultPay = defaultPayMethods.filter(v => (v.defaultChargeMethod === true))
          if (defaultPay.length > 0) {
            this.obj.payObj.paymethod = defaultPay[0].value
          } else {
            // 如果没有默认支付方式，则使用返回数组里面第一个
            this.obj.payObj.paymethod = this.obj.paymethodArr[0] && this.obj.paymethodArr[0].value
          }
        }
        this.payLoading = false
      } catch (err) {
        this.payLoading = false
        console.log(err)
      }
    },
    // 找零金额
    oddchange () {
      let odd = 0.0
      odd =
        this.obj.payObj.flowfee - (this.obj.unexefee || 0).toFixed(2) > 0
          ? this.obj.payObj.flowfee - (this.obj.unexefee || 0).toFixed(2)
          : 0.0
      return odd.toFixed(2)
    },
    // 应收金额（扫码场景）
    changeflowfee (num) {
      let needtopay = 0
      needtopay = (
        (this.obj.totalFee || 0) - (this.obj.exefee || 0)
      ).toFixed(2)
      return needtopay
    },
    // 删除支付流水
    undo (row) {
      this.$confirm('确认作废此支付流水？').then(async _ => {
        try {
          let params = {
            id: row.id
          }
          let data = await cancel(params)
          if (data && data.data) {
            // this.receiptlist()
            this.$emit('listenPay')
          }
        } catch (err) { }
      })
    },
    // 流水列表
    async receiptlist () {
      try {
        let params = {
          id: this.obj.id
        }
        let feeData = await getIpSettlement(params)
        Object.assign(this.obj, feeData.data)
        this.obj.payObj.flowfee = this.obj.unexefee
        this.$emit('listenPay')
      } catch (err) {
        console.log(err)
      }
    },
    // 确认支付（微信支付宝扫码除外）
    async pay () {
      this.isSureLoading = true
      // 正向支付有金额为0的可能
      if (Number(this.obj.payObj.flowfee) < 0) {
        this.$messageTips(this, 'error', '实收金额必须大于等于0')
        this.isSureLoading = false
        return false
      }
      if (this.obj.payObj.paymethod === 3 || this.obj.payObj.paymethod === 4) {
        if (this.obj.payObj.flowfee <= 0) {
          this.$messageTips(this, 'error', '线上付款金额必须大于0')
          this.isSureLoading = false
          return false
        }
        this.toWechatOrAliPay() // 支付宝微信走通道
        return false
      }
      this.payLoading = true
      // 如果是住院支付时，校验支付金额不能大于待支付金额
      if (!this.obj.isDeposit && (Math.abs(this.obj.payObj.flowfee) > Math.abs(this.obj.unexefee))) {
        this.$messageTips(this, 'error', '支付金额不能大于待支付金额')
        this.isSureLoading = false
        this.payLoading = false
        return false
      }
      // 检测是否有使用预授权
      let checkresult = this.checkAuthorizeFee()
      if (!checkresult) {
        this.isSureLoading = false
        this.payLoading = false
        return false
      }
      let params = {
        feeList: [{
          // 支付方式
          payMethod: this.obj.payObj.paymethod,
          // 备注
          remark: this.obj.payObj.remark,
          // 金额
          flowFee: this.obj.payObj.flowfee
        }],
        // 患者id
        patientId: this.obj.patientId,
        // 结算id
        settlementId: this.obj.id,
        // 结算单号
        settlementNo: this.obj.settleCode,
        // 类型1门诊2住院3商城4押金
        type: this.type,
        // 是否退费标识
        refundTag: !!this.obj.isRefund,
        isDeposit: this.obj.isDeposit || 0,
        authCode: this.obj.payObj.auth_code || '', // pos机扫码支付的授权码
        scenes: this.obj.scenes || '' // 入院登记支付之前入院申请单被删除的情况
      }
      // 如果是收费需要计算找零，如果是押金则不需要
      if (parseInt(this.obj.FeeType) === 2) {
        params.feeList[0].flowFee -= this.oddchange()
      } else if (parseInt(this.obj.payObj.paymethod) === 0) {
        if (!this.selectvalue.name) {
          this.$messageTips(this, 'error', '请选择会员卡')
          this.isSureLoading = false
          this.payLoading = false
          return false
        }
        let checkCardPay = this.cardevent()
        if (!checkCardPay) {
          this.isSureLoading = false
          this.payLoading = false
          return false // 会员卡支付校验一下数额
        }
        params.feeList[0]['cardId'] = this.usercardinfo.id
      } else if (parseInt(this.obj.payObj.paymethod) === 9) {
        if (!this.obj.payObj.auth_code || this.obj.payObj.auth_code === '') {
          Notification.error('请扫码')
          this.isSureLoading = false
          this.payLoading = false
          return false
        }
      }
      try {
        let data = await createFlow(params)
        if (data && data.data && data.data.tradeSuccess) {
          if (Number(this.obj.payObj.paymethod) === 0) {
            this.getcard()
          }
          // 押金打印
          this.$emit('getdata', true)
        }
        this.isSureLoading = false
        this.payLoading = false
      } catch (err) {
        this.isSureLoading = false
        this.payLoading = false
        console.log(err)
      }
    },
    serialPay (orderNo, id, fee) {
      let params = {
        payTp: '0',
        orderNo: orderNo,
        amt: fee
      }
      settleapi.serialPay(params).then(rs => {
        if (rs.head.errCode === 0 && !rs.data) {
          this.queryPosType(orderNo, id)
        }
      })
    },
    queryPosType (orderNo, id) {
      if (!this.dialogVisible1) return
      this.posTimer = window.setTimeout(_ => {
        this.posTimer = null
        settleapi.getTradeLog({ flowNumber: orderNo, id: id }).then(rs => {
          if (rs.head.errCode === 0) {
            if (rs.data && rs.data.payState === 1) {
              settleapi.posCreateCharge(rs.data).then(rs => {
                if (rs.head.errCode === 0) {
                  this.isSureLoading = false
                  this.payLoading = false
                }
              })
            } else if (rs.data && rs.data.payState === 0) {
              this.queryPosType(orderNo, id)
            } else {
              this.isSureLoading = false
              this.payLoading = false
            }
          }
        }, rj => {
          this.queryPosType(orderNo, id)
        })
      }, 2000)
    },
    // 扫授权码
    handleScanCode () {
      if (this.obj.payObj.auth_code !== '') {
        let params = {
          patientId: this.$route.query.patientId,
          settlementId: this.obj.id,
          settlementNo: this.obj.settlecode,
          type: 2, // 门诊是1，住院是2
          feeList: [
            {
              payMethod: Number(this.obj.payObj.paymethod),
              flowFee: this.obj.payObj.flowfee,
              remark: this.obj.payObj.remark
            }
          ],
          source: 'MICROPAY',
          authCode: this.obj.payObj.auth_code,
          clinicId: storage.getLocalStorage('CLINICID'),
          host: window.location.origin,
          // host: 'http://testsyzx.everjiankang.com.cn', // 测试阶段使用
          channel: 'unified_trade_micropay',
          flowNumber: this.QRFlowNumber
        }
        this.openPayLoading() // 扫码成功打开loading
        settleapi.tradeCreate(params).then(res => {
          // 根据返回结果进一步处理
          this.handlePayResult(res)
        })
      }
    },
    handlePayResult (res) {
      if (res.head && res.head.errCode === 0) {
        if (res.data && res.data.tradeSuccess) {
          if (res.data && res.data.tradeStatus === 1) { // 支付成功
            if (this.timer) {
              this.resetPayContext()
            }
            // 支付成功之后，流水号清空
            this.QRFlowNumber = ''
            this.$emit('getdata', res.data && res.data.settleStatus)
          } else { // 支付中
            this.polling(res.data.code, undefined, 5000, (result) => {
              this.QRFlowNumber = ''
              this.$emit('getdata', result)
            })
          }
        } else { // 交易失败
          this.resetPayContext()
        }
      } else {
        this.$messageTips(this, 'error', '接口调用出现错误，请稍后再试')
        this.resetPayContext()
      }
    },
    // 轮询支付结果
    /**
     * @flowNumber:支付流水号
     * @num:轮询次数
     * @delay:多长时间一次
     * @callback如果某次成功，执行回调
     */
    polling (flowNumber, num, delay, callback) {
      if (this.timer) { // 如果有先清掉，然后再轮询
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (num !== undefined) {
          num--
          if (num <= 0) { // 轮询结束依然没有结果
            this.$messageTips(this, 'error', '未支付成功')
            this.resetPayContext()
            this.$emit('getdata', false)
            return
          }
        }
        settleapi.query({ flowNumber }).then(v => {
          // tradeStatus:1成功，-1异常，0支付中
          if (v && v.data && v.data.tradeStatus === 1) {
            this.$messageTips(this, 'success', '支付成功')
            callback(v.data && v.data.settleStatus)
            this.resetPayContext()
          } else if (v && v.data && v.data.tradeStatus === -1) {
            this.$messageTips(this, 'error', v.data.tradeMsg)
            this.resetPayContext()
            this.$emit('getdata', false)
          }
        }).catch(err => {
          this.$messageTips(this, 'error', '未支付成功')
          this.resetPayContext()
          this.$emit('getdata', false)
          console.log(err)
        })
      }, delay)
    },
    resetPayContext () {
      this.payLoading = false
      this.isSureLoading = false
      this.payCodeLoading && this.payCodeLoading.close()
      clearInterval(this.timer)
      this.moveLeft = false
      let ele = document.getElementById('authCode')
      ele.blur()
    },
    // 现金扫码刷卡
    selectmethod (obj) {
      if (obj.value === 9) {
        this.obj.payObj.qrfee = this.changeflowfee()
      }
      Object.assign(this.obj.payObj, {
        paymethod: obj.value
      })
    },
    // 针对预授权进行校验
    checkAuthorizeFee () {
      if (Number(this.obj.payObj.paymethod) === 14) { // 如果是14，代表是预授权
        if (this.obj.unexefee >= 0) { // 如果是交押金，押金金额不大于100000
          if (this.obj.payObj.flowfee > 100000) {
            this.$messageTips(this, 'error', '授权权刷卡不能大于100000')
            return false
          }
        }
      }
      if (Number(this.obj.payObj.paymethod) === 15) {
        if (Math.abs(Number(this.obj.payObj.flowfee)) >= Number(this.obj.authrizeFee)) {
          this.$messageTips(this, 'error', '消除预授权不能大于已使用预授权总额')
          return false
        }
      }
      return true
    },
    // 防止意外点击
    preventAccidentClick (e) {
      this.obj.payObj.auth_code = ''
      let ele = document.getElementById('authCode')
      ele.focus()
    }
  }
}
</script>
<style scoped>
.containerOut .paylayer .layout_inner.settle_fee {
  border-radius: 0;
  box-shadow: none;
}
.containerOut .layout_inner.settle_fee {
  padding: 0 20px 0;
}
.containerOut .settle_paymethod {
  float: left;
  width: 50%;
  box-shadow: none;
}
.layout_box .settle_paymethod .settlepaymentbox {
  padding: 10px 15px;
}
.paylayer .settle_fee {
  background-color: #f4f4f4;
}
.paylayer /deep/ .el-dialog__body {
  padding: 0;
}
.settle_fee {
  height: 54px;
  line-height: 54px;
}
#register .settle_fee {
  padding-bottom: 0;
}
.settle_fee .label_name {
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.settle_fee .label_money {
  font-size: 18px;
  color: #000;
  font-weight: 400;
  vertical-align: middle;
}
.settle_fee .label_money_need {
  font-size: 20px;
  color: #ff9c00;
  font-weight: 400;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 30px;
  color: #ff9c00;
  vertical-align: middle;
}
.containerOut {
  width: 100%;
  overflow-x: hidden;
}
.paymethodContainer {
  position: relative;
  width: 200%;
  transition: all 0.7s;
}
.paymethodContainerMoveLeft {
  transform: translateX(-50%);
}
.payCode {
  float: right;
  width: 50%;
  text-align: center;
}
.payCode .authCode {
  position: relative;
  top: -100px;
  z-index: -1;
}
.settle_paymethod_title {
  font-size: 16px;
  color: #000;
  padding-left: 13px;
  border-left: 3px solid #1c7bef;
  margin: 0;
}
.settle_paymethod .el-menu {
  background: #fff;
}
.settle_paymethod_tab {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #000;
  line-height: 16px;
  border-bottom: 1px solid #eee;
  border-radius: 4px 4px 0 0;
}
.settle_paymethod_tab .el-menu-item {
  padding: 0 15px;
}
.settle_paymethod_tab .el-menu-item {
  height: 50px;
  line-height: 50px;
  border-bottom: 3px solid transparent;
}
.settle_paymethod_tab .el-menu-item:hover,
.settle_paymethod_tab .el-menu-item.is-active {
  border-bottom: 3px solid #1c7bef;
  background: #fff;
}
.paymethod_pay {
  padding: 15px 10px;
  clear: both;
}
.paymethod_pay_item {
  cursor: pointer;
  margin-right: 15px;
  margin-bottom: 15px;
  width: 140px;
  padding-left: 20px;
  height: 58px;
  line-height: 58px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 16px;
  vertical-align: middle;
  float: left;
  position: relative;
}
.paymethod_pay_item_noicon {
  width: 100px;
  text-align: center;
  padding: 0;
}
.paymethod_pay_item .iconfont {
  font-size: 25px;
  vertical-align: middle;
}
.paymethod_pay_item .iconfont1 {
  color: #7973e1;
}
.paymethod_pay_item .iconfont2 {
  color: #f2aa37;
}
.paymethod_pay_item .iconfont9 {
  color: #21cfba;
}
.paymethod_pay_item .iconfont3 {
  color: #1aaceb;
}
.paymethod_pay_item .iconfont4 {
  color: #00b700;
}
.paymethod_con {
  height: 86px;
  line-height: 86px;
  vertical-align: middle;
  background: #f8f8f8;
  border: 1px solid #ddd;
  color: #666;
  font-size: 14px;
}
.paymethod_con .el-input {
  margin-left: 10px;
  margin-right: 20px;
  display: inline-block;
  width: 162px;
  color: #000;
}
.paymethod_con .el-input__inner {
  width: 162px;
  height: 40px;
}
.paymethod_con_money {
  margin-left: 20px;
}
.paymethod_con_backmoney span {
  font-size: 16px;
  color: #ff9c00;
}
.paymethod_con .el-button {
  padding: 12px 20px;
  margin-left: 20px;
  margin-top: 22px;
}
.settle_paymethod hr {
  margin: 30px 0;
}
.paymethod_pay_item.active {
  border: 2px solid #1c7bef;
  height: 56px;
  line-height: 56px;
  padding-left: 19px;
  width: 140px;
}
.paymethod_pay_item_noicon.active {
  width: 98px;
  padding-left: 0;
}
.paymethod_pay_item .icon-Selected {
  font-size: 26px;
  position: absolute;
  height: 26px;
  width: 26px;
  right: 0;
  bottom: 15px;
  color: #1c7bef;
}
.settle_paymethod.paymethod_pay .paymethod_pay_item_box {
  overflow-y: auto;
}
</style>
