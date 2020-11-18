<template>
  <el-dialog
    title="支付"
    :visible.sync="dialogVisible1"
    :before-close="handleClose"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    width="1300px"
    class="ui_dialog_02 settle-pay-layer"
  >
    <div v-loading="loading">
      <div class="setHover">
        <div class="settle_fee">
          <el-row>
            <el-col :span="4">
              <span class="label_name">总额：</span>
              <span class="label_money">￥{{obj.totalPayedFee | formatToFinacial}}</span>
            </el-col>
            <el-col :span="4">
              <span class="label_name">已收金额：</span>
              <span class="label_money">￥{{obj.exefee | formatToFinacial}}</span>
            </el-col>
            <el-col :span="4">
              <span class="label_name">医保统筹：</span>
              <span class="label_money">￥{{obj.medInsurPubPayFee | formatToFinacial}}</span>
            </el-col>
            <el-col :span="4">
              <span class="label_name">医保账户：</span>
              <span class="label_money">￥{{obj.medInsurOwnPayFee | formatToFinacial}}</span>
            </el-col>
            <el-col :span="4">
              <span class="label_name">挂单金额：</span>
              <span class="label_money">￥{{pendingorderTotal() | formatToFinacial}}</span>
            </el-col>
            <el-col :span="4">
              <span class="label_name">还需支付：</span>
              <span class="label_pay">￥{{obj.unexefee | formatToFinacial}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="containerOut">
          <div :class="{paymethodContainer:true,paymethodContainerMoveLeft:moveLeft}">
            <div
              class="settle_paymethod"
              :class="{settleaccountpad: obj.settleStatus!=='1' && obj.settleStatus!=='2'}"
              style="margin-top: 20px;"
            >
              <div class="settlepaymentbox">
                <h4 class="settle_paymethod_title">支付选择</h4>
                <el-menu
                  mode="horizontal"
                  class="settle_paymethod_tab"
                  :default-active="activeIndex"
                  @select="handleSelect"
                >
                  <el-menu-item index="1">支付方式</el-menu-item>
                  <el-menu-item index="2" v-if="pendingorderArr && pendingorderArr[0]">挂单</el-menu-item>
                </el-menu>
                <div class="paymethod_pay" v-show="activeIndex === '1'">
                  <div class="paymethod_pay_item_box">
                    <template v-for="item in paymethodArr">
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
                        <i
                          class="iconfont icon-Selected"
                          v-show="obj.payObj.paymethod === item.value"
                        ></i>
                      </div>
                    </template>
                    <div
                      v-if="payChannel.length>0"
                      :class="{paymethod_pay_item:true,active:(obj.payObj.paymethod=='3' || obj.payObj.paymethod=='4')}"
                      @click="selectmethod(payChannel[0])"
                    >
                      <span v-for="item in payChannel" :key="item.value">
                        <i class="iconfont" :class="paymethodsHasIcon[item.value]"></i>
                      </span>
                      <i
                        class="iconfont icon-Selected"
                        v-show="obj.payObj.paymethod ==='3' || obj.payObj.paymethod ==='4'"
                      ></i>
                    </div>
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
                          v-for="item in options"
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
                      <el-button type="primary" @click="pay" :disabled="payLoading">{{btnText}}</el-button>
                    </div>
                  </div>
                  <div class="paymethod_con" v-else style="clear: both;">
                    <div class="paymethod_con_money" v-show="obj.payObj.paymethod === '9'">
                      实收金额
                      <el-input
                        placeholder="请填写金额"
                        type="number"
                        v-model="obj.payObj.qrfee"
                        :disabled="obj.payObj.paymethod === '9'"
                      ></el-input>
                    </div>
                    <div class="paymethod_con_money" v-show="obj.payObj.paymethod !== '9'">
                      实收金额
                      <el-input
                        placeholder="请填写金额"
                        type="number"
                        v-model="obj.payObj.flowfee"
                        :disabled="obj.payObj.paymethod === '7'||obj.payObj.paymethod === '8'"
                        @keyup.native="limitDecimal(obj.payObj.flowfee,obj.payObj.paymethod,'isClick')"
                      ></el-input>
                    </div>
                    <div class="paymethod_con_money" v-if="obj.payObj.paymethod === '9'">
                      授权码
                      <el-input
                        v-focus="obj.payObj.paymethod === '9'"
                        placeholder="请扫码"
                        type="number"
                        v-model="obj.payObj.auth_code"
                      ></el-input>
                    </div>
                    <div class="paymethod_con_money" v-if="obj.payObj.paymethod === '1'">
                      找零金额：
                      <span>￥{{oddchange() | formatToFinacial}}</span>
                    </div>
                    <div class="paymethod_con_money">
                      备注
                      <el-input placeholder="请填写备注" v-model="obj.payObj.remark"></el-input>
                    </div>
                    <el-button type="primary" @click="pay" v-loading="payLoading">确认支付</el-button>
                  </div>
                </div>
                <!--挂单逻辑-->
                <div class="paymethod_pay" v-show="activeIndex === '2'">
                  <div class="paymethod_pay_item_box">
                    <div
                      class="paymethod_pay_item paymethod_pay_item_noicon"
                      :class="{active: obj.payObj.paymethod === item.value}"
                      v-for="item in pendingorderArr"
                      @click="selectmethod(item)"
                      :key="item.value"
                    >
                      {{item.name}}
                      <i
                        class="iconfont icon-Selected"
                        v-show="obj.payObj.paymethod === item.value"
                      ></i>
                    </div>
                  </div>
                  <div class="paymethod_con" style="clear: both;">
                    <div class="paymethod_con_money">
                      挂单金额
                      <el-input placeholder="请填写金额" v-model="obj.payObj.flowfee" disabled></el-input>
                    </div>
                    <el-button
                      style="float: left;"
                      type="primary"
                      @click="pay"
                      :disabled="businessCode !== '' && !$route.query.taskId"
                    >确认挂单</el-button>
                  </div>
                </div>
              </div>
              <div
                class="buttonbox"
                v-show="businessCode !== '' && !$route.query.taskId && obj.settleStatus !== '3'"
                style="position: relative; height: 40px;"
              >
                <el-button
                  type="primary"
                  style="height: 40px; width: 88px; position:absolute; left: 50%; margin-left: -44px;"
                  @click="jumptotask"
                >审批详情</el-button>
              </div>
              <div v-if="$route.query.returnFlag==0&&(obj.settleStatus==3||obj.settleStatus==4)">
                <h4 class="settle_paymethod_title">支付记录</h4>
                <el-table style="width:100%" :data="obj.payTradeLog" border>
                  <el-table-column prop="payName" label="支付方式"></el-table-column>
                  <el-table-column prop="payTime" label="支付时间"></el-table-column>
                  <el-table-column prop="flowFee" label="支付金额">
                    <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
                  </el-table-column>
                  <el-table-column prop="payStatus" label="状态"></el-table-column>
                  <el-table-column prop="remark" label="备注"></el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        size="small"
                        @click="undo(scope.row.id)"
                        :disabled="scope.row.payState === 3 || scope.row.payMethod=== 7 || scope.row.payMethod=== 8"
                      >作废</el-button>
                    </template>
                  </el-table-column>
                </el-table>
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
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import settleapi from '@/rcm/store/settlepaymentapi'
import { Notification } from 'element-ui'
import storage from '@/util/storage'
import useraccountapi from '@/workspace/store/useraccountapi'

export default {
  props: ['obj', 'layershow'],
  data () {
    return {
      loading: false,
      payLoading: false,
      // 退款方式可选
      sourcerefundTable: [],
      refundTable: [],
      activeIndex: '1',
      money: 0,
      businessCode: '',
      pendingorderArr: [],
      paymethodArr: [],
      newPaymethodArr: [],
      payChannel: [],
      otherArr: [],
      receiptId: '',
      moveLeft: false,
      // 有icon的支付方式集中管理
      paymethodsHasIcon: {
        '1': 'icon-cash iconfont1',
        '2': 'icon-card iconfont2',
        '3': 'icon-alipay iconfont3',
        '4': 'icon-wechat iconfont4',
        '9': 'icon-QR iconfont9'
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
      options: [], // 会员卡下拉列表
      payCodeLoading: null,
      posTimer: null,
      timer: null, // 微信支付宝支付中轮询计时器
      // 会员卡相关
      usercardinfo: {
        storedMoney: 0,
        givedMoney: 0,
        allmoney: 0,
        id: '',
        isShareCard: false
      },
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
    // 获取支付url
    getPayUrl () {
      let params = {
        patientId: this.$route.query.patientId,
        settlementId: this.obj.id,
        settlementNo: this.obj.settlecode,
        type: this.obj.payType || 1,
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
        // host: 'http://dev2.everjiankang.com.cn', // 测试阶段使用
        channel: 'unified_qr_in_order'
      }
      return new Promise((resolve, reject) => {
        settleapi.getQRCodeAddress(params).then(res => {
          if (res.data && res.data.success) { // 获取成功了
            this.payUrl = res.data.qrcode
            this.QRFlowNumber = res.data.flowNumber
            // undefined表示一直轮询，除非有结果或者直接关闭弹窗
            this.polling(res.data.flowNumber, undefined, 5000, (isFinish) => {
              this.$emit('getData', isFinish)
            })
            resolve()
          } else { // 获取失败
            this.payLoading = false
            this.$messageTips(this, 'error', res.data.message)
            reject()
          }
        }).catch(err => {
          this.payLoading = false
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

    resetPayContext () {
      this.payLoading = false
      this.payCodeLoading && this.payCodeLoading.close()
      clearInterval(this.timer)
      this.moveLeft = false
      let ele = document.getElementById('authCode')
      ele.blur()
    },
    handleClose (done) {
      // 如果采用了线上渠道支付，直接关闭支付弹窗，要跳转到已结算中去，其他则留在原地
      if (this.QRFlowNumber) {
        this.$emit('getData', true, true)
        this.QRFlowNumber = ''
      } else {
        if (this.obj.iscallback) {
          this.$emit('closedialog', done)
        } else {
          this.dialogVisible1 = false
        }
      }
      // 如果扫码支付中直接关闭支付弹窗了，扫码支付的相关都要清空
      this.resetPayContext()
    },
    getRefundList () {
      settleapi
        .getRefundFlowsBySettlementId(this.$route.query.settlementid)
        .then(data => {
          const member = []
          if (this.obj.payTradeLog.length > 0) {
            this.obj.payTradeLog.forEach(v => {
              if (v.payMethod === 0) {
                member.push({
                  isSave: false,
                  isSourceMember: true,
                  paymethod: v.payMethod,
                  createTime: v.payTime,
                  flowfee: v.flowFee,
                  status: v.status
                })
              }
            })
          }
          if (data && data.data.length > 0) {
            data.data.forEach(v => {
              v.isSave = false
            })
            this.sourcerefundTable = JSON.parse(JSON.stringify(data.data))
            this.refundTable = [...member, ...data.data]
            this.obj.refundArr
          } else {
            this.refundTable = [...member, ...data.data]
          }
          this.obj.refundArr = data.data
        })
        .catch()
    },
    oddchange () {
      let that = this
      let odd = 0.0
      if (that.pendingorderTotal() > 0) {
        odd =
          that.obj.payObj.flowfee -
            ((that.obj.totalPayedFee || 0) - (that.obj.exefee || 0))
              .toFixed(2) >
            0
            ? that.obj.payObj.flowfee -
            ((that.obj.totalPayedFee || 0) - (that.obj.exefee || 0))
              .toFixed(2)
            : 0.0
      } else {
        odd =
          that.obj.payObj.flowfee -
            (
              (that.obj.totalPayedFee || 0) -
              (that.obj.exefee || 0) -
              that.pendingorderTotal()
            ).toFixed(2) >
            0
            ? that.obj.payObj.flowfee -
            (
              (that.obj.totalPayedFee || 0) -
              (that.obj.exefee || 0) -
              that.pendingorderTotal()
            ).toFixed(2)
            : 0.0
      }

      return odd.toFixed(2)
    },
    changeflowfee (num) {
      let that = this

      let needtopay = 0
      if (that.pendingorderTotal() !== 0) {
        needtopay = that.pendingorderTotal().toFixed(2)
        return needtopay
      } else {
        needtopay = (
          (that.obj.totalPayedFee || 0) -
          (that.obj.exefee || 0) -
          that.pendingorderTotal()
        ).toFixed(2)
        return needtopay
      }
    },
    undo (id) {
      let that = this
      that.$confirm('确认作废此支付流水？').then(_ => {
        that.loading = true
        settleapi.del(id).then(
          result => {
            if (result.head.errCode === 0) {
              that.$emit('getData', true)
              Notification.success('操作成功')
            }
            // this.receiptlist()
          },
          errorFn => {
            that.loading = false
          }
        )
      })
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
    pay () {
      if (this.payLoading) {
        return
      }
      let that = this
      let tosubmitfee = 0
      that.payLoading = true
      if (that.obj.payObj.paymethod === '1' && that.oddchange() > 0) { // 只有现金才找零
        tosubmitfee = (
          (that.obj.totalPayedFee || 0) -
          (that.obj.exefee || 0) -
          that.pendingorderTotal()
        ).toFixed(2)
      } else {
        tosubmitfee = that.obj.payObj.flowfee
      }
      if (tosubmitfee < 0) {
        this.$messageTips(this, 'error', '付款金额必须大于或等于0')
        that.payLoading = false
        return false
      }
      if (tosubmitfee > that.obj.unexefee) {
        this.$messageTips(this, 'error', '实收金额不能大于还需支付金额')
        that.payLoading = false
        return false
      }
      if (this.obj.payObj.paymethod === '3' || this.obj.payObj.paymethod === '4') {
        if (tosubmitfee <= 0) {
          this.$messageTips(this, 'error', '线上付款金额必须大于0')
          that.payLoading = false
          return false
        }
        this.toWechatOrAliPay() // 支付宝微信走通道
        return false
      }
      let params = {
        patientId: this.$route.query.patientId,
        settlementId: this.obj.id,
        settlementNo: that.obj.settlecode,
        type: this.obj.payType || 1,
        feeList: [
          {
            payMethod: Number(that.obj.payObj.paymethod),
            flowFee: tosubmitfee,
            remark: that.obj.payObj.remark
          }
        ],
        authCode: that.obj.payObj.auth_code,
        macId: this.macId  // 医保结算时机后移至结算之前了
      }
      if (
        that.obj.payObj.paymethod === '9' &&
        (!that.obj.payObj.auth_code || that.obj.payObj.auth_code === '')
      ) {
        Notification.error('请扫码')
        return false
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
      }
      that.loading = true
      settleapi
        .tradeCreate(params)
        .then(
          result => {
            if (result.data && result.data.code && result.data.polling) {
              that.loading = false
              that.payLoading = false
              let params = {
                payTp: Number(that.obj.payObj.paymethod),
                amt: tosubmitfee,
                orderNo: result.data.code
              }
              settleapi.serial(params).then(v => {
                this.polling(result.data.code, 45, 1000, () => {
                  that.$emit('getData', Number(tosubmitfee) === Number(that.obj.unexefee))
                  that.$emit('paymentSuccess')
                }).catch(err => {
                  console.log(err)
                })
              })
            } else {
              that.loading = false
              that.payLoading = false
              that.$emit('getData', Number(tosubmitfee) === Number(that.obj.unexefee)) // 只支付部分金额不关闭弹窗
              if (this.obj.payObj.paymethod === 0 && Number(tosubmitfee) !== Number(that.obj.unexefee)) {
                // 如果是部分支付，且支付方式是会员卡支付，那么再次调用会员卡接口刷新费用信息
                this.getcard()
              }
            }
          },
          errorFn => {
            that.loading = false
            that.payLoading = false
          }
        )
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
                  this.payLoading = false
                  this.$messageTips(this, 'success', '支付成功')
                  this.$emit('getData', true)
                  this.$emit('paymentSuccess')
                }
              })
            } else if (rs.data && rs.data.payState === 0) {
              this.queryPosType(orderNo, id)
            } else {
              this.$messageTips(this, 'error', '支付失败')
              this.payLoading = false
            }
          }
        }, rj => {
          this.queryPosType(orderNo, id)
        })
      }, 2000)
    },
    pendingorderTotal () {
      let sum = 0
      for (var v in this.obj.recDetails) {
        sum += this.obj.recDetails[v] || 0
      }
      return sum
    },
    // 审批详情
    jumptotask () {
      let that = this
      if (that.$route.query.taskId) {
        window.location.href =
          that.$ever.warehouseIndex +
          '/goods/approval?taskId=' +
          that.$route.query.taskId
      } else {
        window.location.href =
          that.$ever.warehouseIndex +
          '/goods/approval/' +
          that.businessCode +
          '/1'
      }
    },
    toWechatOrAliPay (paymethod) {
      this.getPayUrl().then(_ => {
        this.moveLeft = !this.moveLeft
        setTimeout(_ => {
          this.obj.payObj.auth_code = ''
          let ele = document.getElementById('authCode')
          ele.focus({ preventScroll: true })
        }, 1000)
      })
    },
    selectmethod (obj) {
      let that = this
      if (obj.value === '9') {
        that.obj.payObj.qrfee = that.changeflowfee()
      } else {
        this.obj.payObj.flowfee = this.changeflowfee()
      }
      Object.assign(this.obj.payObj, {
        paymethod: obj.value
      })
    },
    handleSelect (key, keyPath) {
      let that = this
      this.activeIndex = key.toString()
      this.obj.payObj.paymethod =
        key.toString() === '2'
          ? that.pendingorderArr &&
          that.pendingorderArr.length &&
          that.pendingorderArr[0].value
          : that.paymethodArr &&
          that.paymethodArr.length &&
          that.paymethodArr[0].value
      this.obj.payObj.flowfee = this.changeflowfee()
    },
    // 获取支付方式
    paymethod (v) {
      let that = this
      // if (v !== 5) {
      // 支付方式 由值集换成接口 2018.7.9
      settleapi.payment(1).then(result => {
        that.paymethodArr = []
        that.payChannel = []
        that.obj.payObj.paymethod = []
        if (result.head.errCode === 0) {
          let payArr = []
          // 19是取整费，在支付方式一中要过滤掉
          payArr = result.data.default.filter(item => item.value !== 19)
          payArr.forEach(function (item) {
            item.value = item.value && String(item.value)
            if (item.value === '3' || item.value === '4') { // 微信支付宝要单独处理了
              that.payChannel.push(item)
            } else { // 普通支付模式
              that.paymethodArr.push(item)
            }
          })
        }
        if (v === '5') {
          this.newPaymethodArr = [
            ...this.paymethodArr,
            { value: 0, name: '会员卡支付' }
          ]
        }
        that.obj.payObj.paymethod =
          that.paymethodArr &&
          that.paymethodArr.length &&
          that.paymethodArr[0].value
      })
    },
    // 扫授权码
    handleScanCode () {
      if (this.obj.payObj.auth_code !== '') {
        let params = {
          patientId: this.$route.query.patientId,
          settlementId: this.obj.id,
          settlementNo: this.obj.settlecode,
          type: this.obj.payType || 1,
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
            this.loading = false
            this.payLoading = false
            this.$messageTips(this, 'success', '支付成功')
            if (this.timer) {
              this.resetPayContext()
            }
            // 支付成功之后，流水号清空
            this.QRFlowNumber = ''
            this.$emit('getData', res.data && res.data.settleStatus)
          } else { // 支付中
            this.polling(res.data.code, undefined, 5000, (isFinish) => {
              // 支付成功之后，流水号清空
              this.QRFlowNumber = ''
              this.$emit('getData', isFinish)
            })
          }
        } else { // 交易失败
          this.$messageTips(this, 'error', res.data.tradeMsg)
          this.loading = false
          this.resetPayContext()
        }
      } else {
        this.$messageTips(this, 'error', '接口调用出现错误，请稍后再试')
        this.resetPayContext()
        this.loading = false
      }
    },
    // 防止意外点击
    preventAccidentClick (e) {
      this.obj.payObj.auth_code = ''
      let ele = document.getElementById('authCode')
      ele.focus({ preventScroll: true })
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
      if (!this.obj.isRefund && cardFee > this.obj.unexefee && this.obj.unexefee > 0) {
        cardFee = ''
        this.$messageTips(this, 'error', '会员卡支付金额不能大于还需支付')
        return
      }
      // 收费，(非共享卡会员卡)余额小于应收金额
      if (!this.obj.isRefund && !this.usercardinfo.isShareCard && this.obj.unexefee > 0) {
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
    }
  },
  created () {
    this.paymethod(this.obj.settleStatus)
    this.getcard()
  },
  computed: {
    dialogVisible1: {
      get () {
        return this.layershow
      },
      set (val) {
        this.$emit('update:layershow', val)
      }
    },
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
        if (this.obj.unexefee > 0) {
          return '确认支付'
        } else {
          return '确认退款'
        }
      }
    }
  },
  watch: {
    layershow: {
      handler: function (val, oldval) {
        if (val) {
          this.dialogVisible1 = true
          this.paymethod(this.obj.settleStatus)
          this.moveLeft = false
          this.obj.payObj.flowfee = this.changeflowfee()
          this.payLoading = false
          // 会员卡相关
          this.usercardinfo.storedMoney = 0
          this.usercardinfo.givedMoney = 0
          this.usercardinfo.allmoney = 0
          this.usercardinfo.id = ''
          this.usercardinfo.isShareCard = false
        } else {
          this.dialogVisible1 = false
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
.settle-pay-layer .el-dialog {
  width: 60%;
}
.layout_box .settle_fee {
  padding: 0; /* min-width: 1090px;*/
  margin: 0;
  background-color: #f4f4f4;
  padding: 0 20px;
}
.settle_fee {
  height: 60px;
  line-height: 60px;
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
.settle_paymethod {
  float: left;
  width: 50%;
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
.payCodeActive {
  transform: translateX(-100%);
}
.settle_fee .label_name {
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.settle_fee .label_money {
  font-size: 16px;
  color: #000;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 16px;
  color: #ff9c00;
  vertical-align: middle;
}
.layout_box .layout_inner.settle_paymethod.settleaccountpad {
  padding-bottom: 120px;
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
  clear: both;
}
.paymethod_pay_item_box {
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: -1px;
}
.paymethod_pay_item {
  margin-top: 20px;
  margin-right: 20px;
  margin-bottom: 15px;
  width: 120px;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 16px;
  vertical-align: middle;
  display: inline-block;
  position: relative;
  cursor: pointer;
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
  height: 65px;
  line-height: 65px;
  vertical-align: middle;
  font-size: 14px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 10px;
}
.paymethod_con .paymethod_con_money {
  float: left;
}
.paymethod_con .paymethod_con_money + .paymethod_con_money {
  margin-left: 20px;
}
.paymethod_con .el-input {
  margin-left: 10px;
  margin-right: 20px;
  display: inline-block;
  width: 120px;
  color: #000;
}
.paymethod_con .el-button {
  margin-left: 20px;
  margin-top: 10px;
}
.paymethod_con .el-input__inner {
  width: 120px;
  height: 36px;
}

.paymethod_con_backmoney span {
  font-size: 16px;
  color: #ff9c00;
  margin-right: 10px;
}
.settle_paymethod hr {
  margin: 30px 0;
}
.paymethod_pay_item.active {
  border: 2px solid #1c7bef;
  height: 48px;
  line-height: 48px;
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
  bottom: 10px;
  color: #1c7bef;
}
</style>

