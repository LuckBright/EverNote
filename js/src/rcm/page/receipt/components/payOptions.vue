<template>
  <div>
    <div class="layout_inner settle_fee" style="margin-top: 20px;" v-show="obj.unexeFee!=='0'">
      <el-row>
        <el-col :span="8" v-if="(status == 1||status == 0)">
          <span class="label_name">总额：</span>
          <span class="label_money">￥{{obj.payPrice| formatToFinacial}}</span>
        </el-col>
        <el-col :span="8" v-if="(status == 1||status == 0)">
          <template v-if="obj.direction==2|| obj.status==3|| obj.status==4">
            <span class="label_name">退款金额：</span>
            <span class="label_money">￥{{obj.payPrice| formatToFinacial}}</span>
          </template>
          <template v-else>
            <span class="label_name">已收金额：</span>
            <span class="label_money">￥{{obj.exeFee| formatToFinacial}}</span>
          </template>
        </el-col>
        <el-col
          :span="8"
          v-if="(status == 1||status == 0)&&obj.direction!=2&&obj.status!=3&&obj.status!=4"
        >
          <span class="label_name">还需支付：</span>
          <span class="label_pay">￥{{obj.unexeFee| formatToFinacial}}</span>
        </el-col>
        <el-col :span="8" v-if="status == 2">
          <template v-if="obj.direction==2||obj.status==3||obj.status==4">
            <span class="label_name">退款金额：</span>
            <span class="label_pay">￥{{obj.payPrice | formatToFinacial}}</span>
          </template>
          <template v-else>
            <span class="label_name">已付金额</span>
            <span class="label_pay">￥{{obj.exeFee | formatToFinacial}}</span>
          </template>
        </el-col>
        <el-col :span="8" v-if="(status == 1||status == 0)&&obj.direction==2">
          <el-button type="primary" size="small" @click="refundBtn" :disabled="obj.status>1">退款处理</el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click.prevent="print" v-if="status == 2">打印</el-button>
        </el-col>
      </el-row>
    </div>
    <div
      class="containerOut"
      v-if="(status == 1||status == 0)&&obj.direction!=2&&obj.status!=3&&obj.status!=4"
    >
      <div :class="{paymethodContainer:true,paymethodContainerMoveLeft:moveLeft}">
        <div class="settle_paymethod">
          <h4 class="settle_paymethod_title">支付选择</h4>
          <el-menu mode="horizontal" class="settle_paymethod_tab">
            <el-menu-item index="1">支付方式</el-menu-item>
          </el-menu>
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
            <!-- 线上支付icon合并 -->
            <div
              v-if="obj.payChannel&&obj.payChannel.length>0"
              :class="{paymethod_pay_item:true,active:(obj.payObj.paymethod=='3' || obj.payObj.paymethod=='4')}"
              @click="selectmethod(obj.payChannel[0])"
            >
              <span v-for="item in obj.payChannel" :key="item.value">
                <i class="iconfont" :class="paymethodsHasIcon[item.value]"></i>
              </span>
              <i
                class="iconfont icon-Selected"
                v-show="obj.payObj.paymethod =='3' || obj.payObj.paymethod =='4'"
              ></i>
            </div>
            <div class="paymethod_con" style="clear: both;" v-if="obj.payObj.paymethod === 0">
              <div class="paymethod_con_money">
                <el-select
                  v-model="selectvalue"
                  placeholder="请选择"
                  style="margin-left:10px;"
                  value-key="id"
                >
                  <el-option
                    v-for="item in cardOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-input
                  v-model="obj.payObj.flowfee"
                  :disabled="Object.keys(selectvalue).length>0?false:true"
                  @keyup.native="limitDecimal(obj.payObj.flowfee,obj.payObj.paymethod,'isClick')"
                  type="number"
                  @mousewheel.native="mousewheelevent"
                ></el-input>
              </div>
              <div class="paymethod_con_money">
                <div class="paymethodunitbehind">
                  <template v-if="usercardinfo.isShareCard">
                    <span>共享剩余金额:</span>
                    <span class="colorRed">{{usercardinfo.restShareMoney}}</span>
                  </template>
                  <span>余额:</span>
                  <span class="colorRed">{{usercardinfo.allmoney}}</span>
                  <span>（本金：{{usercardinfo.storedMoney}}，赠金：{{usercardinfo.givedMoney}}）</span>
                </div>
              </div>
              <div class="paymethod_con_money">
                <el-button type="primary" @click="pay" :disabled="isSureLoading">{{btnText}}</el-button>
              </div>
            </div>
            <div class="paymethod_con" v-else style="clear: both;">
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
                  :disabled="obj.payObj.paymethod === 9"
                ></el-input>
              </div>
              <div
                class="paymethod_con_money"
                style="float: left;"
                v-show="obj.payObj.paymethod !== 9"
              >
                实收金额
                <el-input
                  placeholder="请填写金额"
                  type="number"
                  v-model="obj.payObj.flowfee"
                  @keyup.native="limitDecimal(obj.payObj.flowfee,obj.payObj.paymethod,'isClick')"
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
              <div
                class="paymethod_con_backmoney"
                style="float: left;"
                v-if="obj.payObj.paymethod === 1"
              >
                找零金额：
                <span>￥{{oddchange() | formatToFinacial}}</span>
              </div>
              <div class="paymethod_con_money" style="float: left;">
                备注
                <el-input placeholder="请填写备注" v-model="obj.payObj.remark"></el-input>
              </div>
              <el-button
                style="float: left;"
                type="primary"
                @click="pay"
                :loading="isSureLoading"
                :disabled="obj.unexeFee==0"
              >确认支付</el-button>
            </div>
          </div>
        </div>
        <div class="payCode" @click="preventAccidentClick">
          <div class="code">
            <qrcode :value="payUrl" :options="payOptions"></qrcode>
            <!-- <el-button @click="moveLeft=!moveLeft">测试左移</el-button> -->
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
          <el-button type="primary" size="small" @click="back">返回</el-button>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="payTradeLog">
      <hr v-if="(status ==1||status ==0)&&obj.direction!=2&&obj.status!=3&&obj.status!=4" />
      <h4 class="settle_paymethod_title">支付记录</h4>
      <el-table style="width:100%" :data="obj.payTradeLog" border>
        <el-table-column prop="payName" label="支付方式"></el-table-column>
        <el-table-column prop="payTime" label="支付时间"></el-table-column>
        <el-table-column prop="flowFee" label="支付金额">
          <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
        </el-table-column>
        <el-table-column prop="payState" label="状态">
          <template slot-scope="scope">{{scope.row.payStatus}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="small"
              v-if="checkCancel(scope.row)"
              @click="undo(scope.row)"
              :disabled="!(scope.row.payStatus==='支付成功')||obj.status==2"
            >作废</el-button>
            <el-button
              v-if="checkCanShow(scope.row)"
              type="primary"
              @click="synchState(scope.row,true)"
            >同步状态</el-button>
            <el-dropdown @command="handleCommand" v-if="checkCanPayAgain(scope.row)">
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{func:'payAgain',args:[scope.row]}">再次支付</el-dropdown-item>
                <el-dropdown-item :command="{func:'retreat',args:[scope.row]}">撤销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <tradelogpay :tradelogpayshow.sync="tradelogpayshow" :obj="payObj" @getData="getData()"></tradelogpay>
    </div>
  </div>
</template>
<script>
import tradelogpay from '@/rcm/page/pay/paytradelog.vue'
import {
  getPayList,
  createFlow,
  cancel,
  refund,
  changeStatusAtMarketCenter
} from '../../../store/marketingReceiptApi'
import { everprint } from '@/util/common'
import { Notification } from 'element-ui'
import settleapi from '@/rcm/store/settlepaymentapi'
import storage from '@/util/storage'
import useraccountapi from '@/workspace/store/useraccountapi'
export default {
  props: ['obj', 'tableList', 'age'],
  data () {
    return {
      money: 0,
      businessCode: '',
      payedList: [],
      pendingorderArr: [],
      otherArr: [],
      receiptId: '',
      status: this.$route.query.status,
      settlementId: this.$route.query.settlementId,
      patientId: this.$route.query.patientId,
      direction: this.$route.query.direction,
      orderNo: this.$route.query.orderNo,
      isSureLoading: false,
      // 有icon的支付方式集中管理
      paymethodsHasIcon: {
        '1': 'icon-cash iconfont1',
        '2': 'icon-card iconfont2',
        '3': 'icon-alipay iconfont3',
        '4': 'icon-wechat iconfont4',
        '5': 'icon-cash iconfont1',
        '6': 'icon-cash iconfont1',
        '7': 'icon-cash iconfont1',
        '9': 'icon-QR iconfont9',
        '10': 'icon-card iconfont2',
        '11': 'icon-alipay iconfont4',
        '12': 'icon-alipay iconfont3',
      },
      cardOptions: [], // 会员卡下拉项
      moveLeft: false,
      payUrl: '未能请求到二维码参数，暂时无法使用主扫支付', // 获取线上支付url
      QRFlowNumber: '', // 生成的线上支付流水号
      payOptions: {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        rendererOpts: {
          quality: 0.3
        },
        width: 200
      },
      payCodeLoading: null, // 线上支付遮罩
      // 会员卡相关
      usercardinfo: {
        storedMoney: 0,
        givedMoney: 0,
        allmoney: 0,
        id: '',
        isShareCard: false
      },
      // 再次支付相关
      tradelogpayshow: false,
      payObj: {}
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
  methods: {
    async print () {
      everprint('RCM-market', { uid: this.settlementId, age: this.age }, { preview: true })
    },
    // 找零金额
    oddchange () {
      let odd = 0.0
      // settlestatus挂单
      odd =
        this.obj.payObj.flowfee - (this.obj.unexeFee || 0).toFixed(2) > 0
          ? this.obj.payObj.flowfee - (this.obj.unexeFee || 0).toFixed(2)
          : 0.0
      return odd.toFixed(2)
    },
    // 应收金额（扫码场景）
    changeflowfee (num) {
      let needtopay = 0
      needtopay = ((this.obj.payPrice || 0) - (this.obj.exefee || 0)).toFixed(
        2
      )
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
            this.$emit('getData')
            this.receiptlist()
          }
        } catch (err) { }
      })
    },
    refundBtn () {
      this.$confirm('确认退款？').then(async _ => {
        try {
          let params = {
            settlementId: this.settlementId, // 订单号
            type: 3 // 订单号
          }
          let data = await refund(params)
          if (data && data.data && data.data.tradeSuccess) {
            this.$notify({
              type: 'success',
              message: '退款成功'
            })
            this.setMealPayCall('2')
          } else {
            this.$notify({
              type: 'error',
              message: data.data.message || '退款失败'
            })
          }
        } catch (err) { }
      })
    },
    // 流水列表
    async receiptlist () {
      let that = this
      that.obj.loading = true
      try {
        let params = {
          id: this.settlementId
        }
        let data = await getPayList(params)
        if (data && data.data) {
          Object.assign(this.obj, data.data)
          this.obj.payObj.qrfee = this.obj.unexeFee
          this.obj.payObj.flowfee = this.obj.unexeFee
          this.obj.settlementNo = this.obj.settlementNo
          if (
            parseFloat(this.obj.unexeFee) === 0 &&
            parseInt(this.status) === 1
          ) {
            this.setMealPayCall('1')
            this.print()
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    setMealPayCall (type) { // 如果是套餐订单，支付完成后要手动更改订单状态
      if (this.tableList[0]['bizType'] === 3) {
        changeStatusAtMarketCenter({ settlementId: this.settlementId, payStatus: type }).then(result => {
          if (type === '2') {
            this.$emit('getData')
            // this.$router.replace('/rcm/paymentDetail?membersNo=' + this.membersNo + '&settlementId=' + this.settlementId + '&orderNo=' + this.orderNo + '&status=2&patientId=' + this.patientId + '&direction=' + this.direction)
            this.$router.push('/rcm/receipt/tabs/2')
          }
        }).catch(reject => {
          if (type === '2') {
            this.$emit('getData')
            // this.$router.replace('/rcm/paymentDetail?membersNo=' + this.membersNo + '&settlementId=' + this.settlementId + '&orderNo=' + this.orderNo + '&status=2&patientId=' + this.patientId + '&direction=' + this.direction)
            this.$router.push('/rcm/receipt/tabs/2')
          }
        })
      } else {
        this.$router.push('/rcm/receipt/tabs/2')
      }
    },
    // 确认支付（微信支付宝扫码除外）
    async pay () {
      this.isSureLoading = true
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
        settlementId: this.obj.settlementId,
        // 结算单号
        settlementNo: this.obj.settlementNo,
        // 类型1门诊2住院 3商城
        type: 3,
        authCode: this.obj.payObj.auth_code
      }
      if (this.obj.payObj.paymethod === 1) {
        params.feeList[0].flowFee = this.obj.payObj.flowfee - this.oddchange()
      } else if (this.obj.payObj.paymethod === 3 || this.obj.payObj.paymethod === 4) {
        this.toweixinpay()
        return false
      } else if (this.obj.payObj.paymethod === 9) {
        if (!this.obj.payObj.auth_code || this.obj.payObj.auth_code === '') {
          Notification.error('请扫码')
          return false
        }
      } else if (parseInt(this.obj.payObj.paymethod) === 0) {
        if (!this.selectvalue.name) {
          this.$messageTips(this, 'error', '请选择会员卡')
          this.isSureLoading = false
          return false
        }
        let checkCardPay = this.cardevent()
        if (!checkCardPay) {
          this.isSureLoading = false
          return false // 会员卡支付校验一下数额
        }
        params.feeList[0]['cardId'] = this.usercardinfo.id
      }
      try {
        let data = await createFlow(params)
        if (data && data.data && data.data.tradeSuccess) {
          this.receiptlist()
        }
        this.isSureLoading = false
      } catch (err) {
        this.isSureLoading = false
        console.log(err)
      }
    },
    // 线上支付轮询
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
          }
        }).catch(err => {
          this.$messageTips(this, 'error', '未支付成功')
          this.resetPayContext()
          console.log(err)
        })
      }, delay)
    },
    // 获取支付url
    getPayUrl () {
      let params = {
        patientId: this.$route.query.patientId,
        settlementId: this.obj.id,
        settlementNo: this.obj.settlementNo,
        type: 3, // 门诊1，住院2，营销3
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
        // host: 'http://dev4a.everjiankang.com.cn', // 测试阶段使用
        channel: 'unified_qr_in_order'
      }
      return new Promise((resolve, reject) => {
        settleapi.getQRCodeAddress(params).then(res => {
          if (res.data && res.data.success) { // 获取成功了
            this.payUrl = res.data.qrcode
            this.QRFlowNumber = res.data.flowNumber
            // undefined表示一直轮询，除非有结果或者直接关闭弹窗
            this.polling(res.data.flowNumber, undefined, 5000, (isFinish) => {
              this.receiptlist()
              this.isSureLoading = false
            })
            resolve()
          } else { // 获取失败
            this.$messageTips(this, 'error', res.data.message)
            reject()
          }
        }).catch(err => {
          console.log(err)
          this.isSureLoading = false
        })
      })
    },
    // 微信支付宝
    toweixinpay (payMethod) {
      this.getPayUrl().then(_ => {
        this.moveLeft = !this.moveLeft
        setTimeout(_ => {
          this.obj.payObj.auth_code = ''
          let ele = document.getElementById('authCode')
          ele.focus({ preventScroll: true })
        }, 1000)
      }).catch(_ => {
        this.isSureLoading = false
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
    // 扫授权码
    handleScanCode () {
      if (this.obj.payObj.auth_code !== '') {
        let params = {
          patientId: this.$route.query.patientId,
          settlementId: this.obj.id,
          settlementNo: this.obj.settlementNo,
          type: 3,
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
          // host: 'http://dev2.everjiankang.com.cn', // 测试阶段使用
          channel: 'unified_trade_micropay',
          flowNumber: this.QRFlowNumber
        }
        this.openPayLoading() // 扫码成功，打开loading
        settleapi.tradeCreate(params).then(res => {
          // 根据返回结果进一步处理
          this.handlePayResult(res)
        }).catch(err => {
          this.$messageTips(this, 'error', err)
          this.resetPayContext()
        })
      }
    },
    // 微信支付宝支付结果处理
    handlePayResult (res) {
      if (res.head && res.head.errCode === 0) {
        if (res.data && res.data.tradeSuccess) {
          if (res.data && res.data.tradeStatus === 1) { // 支付成功
            this.$messageTips(this, 'success', '支付成功')
            if (this.timer) {
              this.resetPayContext()
            }
            // 支付成功之后，流水号清空
            this.QRFlowNumber = ''
            this.resetPayContext()
          } else { // 支付中
            this.polling(res.data.code, undefined, 5000, (isFinish) => {
              // 支付成功之后，流水号清空
              this.QRFlowNumber = ''
              this.resetPayContext()
            })
          }
        } else { // 交易失败
          this.$messageTips(this, 'error', res.data.tradeMsg)
          this.resetPayContext()
        }
      } else {
        this.$messageTips(this, 'error', '接口调用出现错误，请稍后再试')
        this.resetPayContext()
      }
    },
    // 线上支付善后
    resetPayContext (flag) {
      this.payCodeLoading && this.payCodeLoading.close()
      clearInterval(this.timer)
      this.moveLeft = false
      let ele = document.getElementById('authCode')
      ele && ele.blur()
      this.isSureLoading = false
      if (!flag) {
        this.receiptlist()
      }
    },
    // 防止意外点击
    preventAccidentClick (e) {
      this.obj.payObj.auth_code = ''
      let ele = document.getElementById('authCode')
      ele.focus({ preventScroll: true })
    },
    back () {
      this.resetPayContext()
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
    synchState (row, showTip) {
      settleapi.query({ flowNumber: row.flowNumber }).then(res => {
        if (showTip) {
          this.$messageTips(this, 'success', '状态更新成功')
        }
        this.$emit('refreshData')
      }).catch(err => {
        this.$messageTips(this, 'error', `状态同步失败,原因：${err}`)
      })
    },
    checkIfDisabled (row) {
      // 以下情况不允许作废，3关闭，7表示个人挂单,8表示保险挂单，6表示已退费，refund表示退费，chargeId表示线上支付渠道
      return row.payState === 3 || row.payMethod === 7 || row.payMethod === 8 || this.obj.settleStatus === 6 || this.obj.refund || row.chargeId !== undefined
    },
    // 再次支付
    payAgain (row) {
      Object.assign(this.payObj, row)
      this.tradelogpayshow = true
    },
    getData () {
      this.tradelogpayshow = false
      this.receiptlist()
    },
    // 线上支付撤销
    retreat (row) {
      settleapi.retreatFlow({ flowNumber: row.flowNumber }).then(res => {
        if (res.data.tradeSuccess) { // 撤销成功
          row.payStatus = res.data.tradeLog.payStatus
          row.payState = res.data.tradeLog.payState
          this.$messageTips(this, 'success', res.data.tradeMsg)
        } else { // 撤销失败
          this.$messageTips(this, 'error', res.data.tradeMsg)
        }
      }, err => {
        console.log(err)
      })
    },
    checkCanShow (row) {
      // 只有线上通道的允许同步状态
      return row.chargeId !== undefined
    },
    checkCanPayAgain (row) {
      // 线上渠道支付，支付状态为支付中的
      return (row.chargeId !== undefined) && (row.payState === 0)
    },
    handleCommand (command) {
      this[command.func].apply(this, command.args)
    },
    // 限制金额只能两位小数
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
      if (!this.obj.isRefund && cardFee > this.obj.unexeFee && this.obj.unexeFee > 0) {
        cardFee = ''
        this.$messageTips(this, 'error', '会员卡支付金额不能大于还需支付')
        return
      }
      // 收费，(非共享卡会员卡)余额小于应收金额
      if (!this.obj.isRefund && !this.usercardinfo.isShareCard && this.obj.unexeFee > 0) {
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
              this.cardOptions = r.data
            }
          }
        })
    },
    // 是否可以作废,有权限且不是线上支付
    checkCancel (row) {
      return this.$hasPermission('Auth_menu_eop_fee_cancel') && !row.chargeId
    }
  },
  created () {
    this.getcard()
  },
  beforeDestroy () {
    this.resetPayContext(true)
  },
  computed: {
    selectvalue: {
      get () {
        return this.usercardinfo
      },
      set (val) {
        this.usercardinfo = val
        if (Object.keys(val).length > 0) {
          this.usercardinfo.allmoney =
            Number(val.storedMoney) + Number(val.givedMoney)
        }
      }
    },
    btnText: {
      get () {
        if (this.obj.unexeFee > 0) {
          return '确认支付'
        } else {
          return '确认退款'
        }
      }
    }
  },
  components: {
    tradelogpay
  }
}
</script>
<style scoped>
.layout_box .layout_inner.settle_fee {
  padding: 0 20px 0;
  min-width: 1090px;
}
.settle_fee {
  height: 86px;
  line-height: 86px;
}
.settle_fee .label_name {
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.settle_fee .label_money {
  font-size: 20px;
  color: #000;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 30px;
  color: #ff9c00;
  vertical-align: middle;
}
.settle_paymethod_title {
  font-size: 16px;
  color: #000;
  padding-left: 13px;
  border-left: 3px solid #1c7bef;
  margin-top: 10px;
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
  clear: both;
}
.paymethod_pay_item {
  margin: 15px;
  width: 120px;
  padding-left: 20px;
  height: 60px;
  line-height: 60px;
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
.paymethod_con .paymethod_con_money {
  float: left;
}
.paymethod_con .paymethod_con_money + .paymethod_con_money {
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
  height: 58px;
  line-height: 58px;
  padding-left: 19px;
  width: 119px;
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
.containerOut {
  width: 100%;
  overflow-x: hidden;
  background-color: white;
  margin-top: 20px;
}
.paymethodContainer {
  position: relative;
  width: 200%;
  transition: all 0.7s;
}
.settle_paymethod {
  float: left;
  width: 50%;
}
.payTradeLog {
  background-color: white;
  margin-top: 20px;
  padding: 10px;
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
.paymethodContainerMoveLeft {
  transform: translateX(-50%);
}
</style>
