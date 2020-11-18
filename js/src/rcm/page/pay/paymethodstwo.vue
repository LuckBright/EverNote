<template>
  <el-dialog
    :title="obj.isRefund ?'退款信息':'收款信息'"
    :visible.sync="v"
    width="1300px"
    v-loading="payLoading"
    class="paytwo"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="scoll">
      <div class="settle_fee" style="margin-top:0px;">
        <ul class="feelist clearfix">
          <li>
            <span class="label_name">本人金额：</span>
            <span class="label_money">￥{{allgiftfee | formatToFinacial}}</span>
          </li>
          <li>
            <span class="label_name">关系人金额：</span>
            <span class="label_money">￥{{allsharegifefee | formatToFinacial}}</span>
            <span class="brright">|</span>
          </li>
          <li>
            <span class="label_name">医保统筹：</span>
            <span class="label_money">￥{{obj.medInsurPubPayFee | formatToFinacial}}</span>
          </li>
          <li>
            <span class="label_name">医保账户：</span>
            <span class="label_money">￥{{obj.medInsurOwnPayFee | formatToFinacial}}</span>
            <span class="brright">|</span>
          </li>
          <li>
            <span class="label_name">总额：</span>
            <span class="label_money">￥{{obj.totalFee | formatToFinacial}}</span>
          </li>
          <li>
            <span class="label_name">{{'优惠金额：'}}</span>
            <span class="label_dis_need">￥{{obj.totalDiscount | formatToFinacial}}</span>
          </li>
          <li>
            <span class="label_name">{{obj.isRefund ?'还需退款：':'还需支付：'}}</span>
            <span class="label_money_need cRed">￥{{obj.unexefee | formatToFinacial}}</span>
          </li>
        </ul>
      </div>
      <div class="settle_paymethod">
        <div class="settlepaymentbox">
          <div class="paymethodList">
            <el-row
              v-for="(list,index) in feeList.filter(v=>(v.payMethod == 0 || v.payMethod == 1))"
              :key="list.payMethod"
              class="paymethod_con1"
            >
              <el-col :span="8">
                <el-col :span="8" class="paymethodlabel">
                  <!-- <el-button v-if='list.clearChargeMethod' type="text" @click="clearclick(list)">{{list.defaultChargeMethod?'(默认)':''}}{{list.name}}</el-button> -->
                  <span>{{list.defaultChargeMethod?'(默认)':''}}{{list.name}}</span>
                </el-col>
                <el-col :span="10">
                  <template v-if="list.payMethod == 1">
                    <el-input
                      v-model="list.flowFee"
                      @keyup.native="limitDecimal(list.flowFee,list.payMethod,'isClick')"
                      type="number"
                      @mousewheel.native="mousewheelevent"
                      @change="formatNumber(list.flowFee,list.payMethod)"
                    >
                      <i
                        slot="suffix"
                        class="getvalue"
                        v-if="list.clearChargeMethod"
                        @click="clearclick(list)"
                      >取值</i>
                    </el-input>
                  </template>
                  <template v-if="list.payMethod == 0">
                    <el-input v-model="checkdata" :disabled="iscarddisabled">
                      <i
                        slot="suffix"
                        class="icon iconfont icon-menzhen-shoufei-yanz"
                        @click="checkcard"
                      ></i>
                    </el-input>
                  </template>
                </el-col>
              </el-col>
              <el-col :span="8">
                <template v-if="list.payMethod == 1">
                  <el-col :span="8" class="paymethodlabel">
                    <span class="receive" @click="receivebtn">接收</span>
                  </el-col>
                  <el-col :span="10" class="paycharge">
                    <el-input
                      v-model="receive"
                      type="number"
                      @keyup.native="chargeevent(list.flowFee)"
                      @mousewheel.native="mousewheelevent"
                    >
                      <i slot="suffix" class="getvalue" @click="receivebtn">取值</i>
                    </el-input>
                  </el-col>
                </template>
                <template v-if="list.payMethod == 0">
                  <el-col :span="8" class="payselect">
                    <el-select
                      v-model="selectvalue"
                      placeholder="请选择"
                      style="margin-left:10px;"
                      value-key="id"
                      @change="cardchange"
                      :disabled="obj.isRefund==true?false:iscardcheck"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="10" class="payinput">
                    <el-input
                      v-model="list.flowFee"
                      :disabled="dis"
                      @keyup.native="limitDecimal(list.flowFee,list.payMethod,'isClick')"
                      type="number"
                      @mousewheel.native="mousewheelevent"
                      @change="formatNumber(list.flowFee,list.payMethod)"
                    ></el-input>
                  </el-col>
                </template>
              </el-col>
              <el-col :span="8">
                <!-- 现金 -->
                <template v-if="list.payMethod == 1">
                  <div class="paymethodunitbehind" v-if="list.payMethod === 1">
                    <el-col :span="8" class="textlabel">
                      <span class="chargefee">找零金额:</span>
                    </el-col>
                    <el-col :span="10">
                      <span class="colorRed chargefee bfont">￥{{changeBack | formatToFinacial}}</span>
                    </el-col>
                  </div>
                </template>
                <!-- 会员卡 -->
                <template v-if="list.payMethod == 0">
                  <div class="paymethodunitbehind" v-if="list.payMethod === 0">
                    <template v-if="usercardinfo.isShareCard">
                      <el-col :span="8" class="textlabel">
                        <span>共享剩余金额:</span>
                      </el-col>
                      <el-col :span="15">
                        <span class="colorRed">{{usercardinfo.restShareMoney | fixnum}}</span>
                        <span class="textlabel">可用余额:</span>
                        <span class="colorRed">{{usercardinfo.allmoney | formatToFinacial}}</span>
                      </el-col>
                    </template>
                    <template v-else>
                      <el-col :span="8" class="textlabel">
                        <span>可用余额:</span>
                      </el-col>
                      <el-col :span="15">
                        <span class="colorRed">{{usercardinfo.allmoney | formatToFinacial}}</span>
                      </el-col>
                    </template>
                  </div>
                </template>
              </el-col>
            </el-row>
            <div class="otherPaymethod">
              <el-col
                :span="8"
                v-for="(list,index) in feeList.filter(v=>(v.payMethod != 0 && v.payMethod != 1&&v.payMethod != 19))"
                :key="list.payMethod"
                class="paymethod_con1"
              >
                <el-col :span="8" class="paymethodlabel">
                  <!-- <el-button v-if='list.clearChargeMethod' type="text" @click="clearclick(list)">{{list.defaultChargeMethod?'(默认)':''}}{{list.name}}</el-button> -->
                  <span>{{list.defaultChargeMethod?'(默认)':''}}{{list.name}}</span>
                </el-col>
                <el-col :span="10">
                  <el-input
                    v-model="list.flowFee"
                    @keyup.native="limitDecimal(list.flowFee,list.payMethod,'isClick')"
                    type="number"
                    @mousewheel.native="mousewheelevent"
                    @change="formatNumber(list.flowFee,list.payMethod)"
                  >
                    <i
                      slot="suffix"
                      class="getvalue"
                      v-if="list.clearChargeMethod"
                      @click="clearclick(list)"
                    >取值</i>
                  </el-input>
                </el-col>
              </el-col>
              <div class="clearfix"></div>
            </div>
            <div class="remark">
              <div class="label">
                <span :class="{remarkicon:obj.isRefund}">备注</span>
              </div>
              <div class="remarkcontent">
                <el-input type="textarea" v-model="remark" :class="{remarbg:obj.isRefund}"></el-input>
              </div>
              <div class="clearfix"></div>
            </div>
            <slot name="refundslot"></slot>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <span class="paymethod_con_label">抹零金额:</span>
      <span class="paymethod_con_money">￥{{Number(roundFee).toFixed(2)}}</span>
      <span class="paymethod_con_label">{{obj.isRefund ? '实退金额：' : '实收金额：'}}</span>
      <span class="paymethod_con_money">￥{{Number(totalFeeActually).toFixed(2)}}</span>
      <el-button
        type="primary"
        :disabled="isSureLoading"
        @click="pay"
      >{{obj.isRefund ? '确认退款' : '确认收款'}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getPayment,
  cancel,
  createFlow,
  searchFuzzy,
  getValueByCode,
} from '@/rcm/store/inpatientSettlement/inpatientSettlement'
import useraccountapi from '@/workspace/store/useraccountapi'
import { floatTool } from '@/util/common'
// floatTool.add(a,b)相加 floatTool.subtract(a,b)相减 floatTool.multiply(a,b)相乘
// floatTool.divide(a,b)相除
export default {
  props: ['dialogVisible', 'obj'],
  data () {
    return {
      // 支付按钮loading
      isSureLoading: false,
      //   弹窗loading
      payLoading: false,
      //   支付对象
      feeList: [],
      // 实际支付总额
      totalFeeActually: 0,
      initPayobj: {
        paymethod: ''
      },
      remark: '',
      usercardinfo: {
        storedMoney: 0,
        givedMoney: 0,
        allmoney: 0,
        id: '',
        isShareCard: false
      },
      options: [],
      changeBack: 0,
      receive: '',
      roundFee: 0,
      // 本人会员卡余额
      allgiftfee: 0,
      // 本人共享卡余额
      allsharegifefee: 0,
      checkdata: '',
      iscardcheck: true,
      iscarddisabled: true,
      // 现金取整类型
      roundType: 0,
      // 接口金额计算的方法
      receiveType: ''
    }
  },
  created () {
    this.payList()
  },
  filters: {
    fixnum (val) {
      if (val) {
        return Number(val).toFixed(2)
      } else {
        return 0
      }
    }
  },
  computed: {
    dis () {
      if (this.obj.isRefund) {
        if (Object.keys(this.selectvalue).length > 0) {
          return false
        } else {
          return true
        }
      } else {
        if (Object.keys(this.selectvalue).length > 0) {
          if (this.iscardcheck) {
            return true
          } else {
            return false
          }
        } else {
          return true
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
    selectvalue: {
      get () {
        return this.usercardinfo
      },
      set (val) {
        this.usercardinfo = val
        if (Object.keys(val).length > 0) {
          this.usercardinfo.allmoney =
            (Number(val.storedMoney) + Number(val.givedMoney)).toFixed(2)
        }
      }
    },
  },
  watch: {
    dialogVisible: {
      handler: async function (val, oldval) {
        // 弹窗打开时，将上次的数据清零
        if (val) {
          await this.getcard()
          await this.getcode()
          await this.getRoundingByCode()
          let cashArr = this.feeList.filter(v => Number(v.payMethod) === 1)
          // 将上次的找零金额清空
          if (cashArr.length > 0) {
            this.remark = ''
            this.selectvalue = {}
            this.feeList.map(v => {
              v.flowFee = ''
            })
            this.feeList.map(v => {
              // 是否走反算流程
              if (this.obj.backCalculation === false) {
                return
              }
              if (v.defaultChargeMethod) {
                if (Number(v.payMethod) === 1) {
                  this.computedRounding(this.roundType, Number(this.obj.unexefee))
                } else {
                }
                v.flowFee = Number(this.obj.unexefee).toFixed(2)
                this.totalFeeActually = v.flowFee
              } else {
                v.flowFee = ''
              }
            })
            // 抹零带来的找零结果
            const roundFeeResult = this.roundFee > 0
              ? (this.receive - cashArr[0].flowFee)
              : this.roundFee === 0
                ? 0
                : -this.roundFee
            this.changeBack = this.receive - cashArr[0].flowFee - roundFeeResult
          } else {
            this.changeBack = 0
          }
        } else {
          // 每次弹窗将已填的金额清空
          this.receive = ''
          this.changeBack = 0
          // this.obj.unexefee = 0
          // this.obj.totalFee = 0
          this.checkdata = ''
          this.iscardcheck = true
          this.totalFeeActually = ''
          this.feeList.map(v => (v.flowFee = ''))
        }
      },
      immediate: true
    }
  },
  methods: {
    formatNumber (fee, paymethod) {
      this.feeList.forEach(v => {
        Number(v.payMethod) === Number(paymethod) ? (v.flowFee = fee ? Number(fee).toFixed(2) : '') : null
      })
    },
    // 接收
    receivebtn () {
      let { flowFee = 0 } = this.feeList.find(
        v => v.payMethod === 1
      ) || {}
      this.receive = floatTool[this.receiveType || 'subtract'](flowFee, this.roundFee).toFixed(2)
      this.chargeevent(this.receive)
    },
    async getcode () {
      try {
        let params = {
          code: 'storedcard_swingcard_check'
        }
        let data = await getValueByCode(params)
        if (data.data === '1') {
          // 需要刷卡
          this.iscarddisabled = false
          this.iscardcheck = true
        } else if (data.data === '0') {
          // 不需要刷卡可以选择会员卡
          this.iscarddisabled = true
          this.iscardcheck = false
        }
      } catch (err) {
        this.iscarddisabled = true
        this.iscardcheck = false
      }
    },
    async getRoundingByCode () {
      try {
        let params = {
          code: 'wipe_zero_rounding_rule'
        }
        let data = await getValueByCode(params)
        // 0不取整1抹零到角2进位到五角0.25-0.75之间3向下精确到元
        this.roundType = data.data
      } catch (err) {
        this.iscarddisabled = true
        this.iscardcheck = false
      }
    },
    // 获取现金
    getCash () {
      let { flowFee = 0 } = this.feeList.find(
        v => v.payMethod === 1
      ) || {}
      this.computedRounding(this.roundType, flowFee)
    },
    // 计算现金取整费用
    computedRounding (type, fee) {
      if (fee <= 0) {
        this.roundFee = 0
        return
      }
      this.receiveType = 'subtract'
      switch (Number(type)) {
        case 0: // 不取整
          this.roundFee = 0
          break
        case 1: // 直接抹零到角
          this.roundFee = floatTool.subtract(fee, floatTool.divide(parseInt(floatTool.multiply(fee, 10)), 10))
          break
        case 3: // 向下精确到元
          this.roundFee = floatTool.subtract(Number(fee), parseInt(fee))
          break
        case 4: // 直接进位到角
          if (/\.\d(\d+)/.test(fee)) {
            let intPart = parseInt(fee)
            let decimal = floatTool.subtract(Number(fee), parseInt(fee))
            let ceilFee = floatTool.add(intPart, Math.ceil(decimal * 10) / 10)
            this.roundFee = floatTool.subtract(fee, ceilFee)
          } else {
            this.roundFee = 0
          }
          break
        case 5: // 四舍五入
          // 按分位四舍五入，进位到角
          this.roundFee = floatTool.subtract(Number(fee), Number(fee).toFixed(1))
          break
        default:
          this.roundFee = 0
          break
      }
    },
    // 会员卡事件
    cardchange (val) {
      // 退费会员卡金额不带入
      if (this.obj.isRefund) {
        return
      }
      // 共享卡
      let cardarr = this.feeList.filter(v => Number(v.payMethod) === 0)
      if (val.memberCardShare) {
        // 余额小于共享额度取余额度
        if (Number(val.memberCardShare.restShareMoney) >= Number(val.allmoney)) {
          if (Number(val.allmoney) >= Number(this.obj.unexefee)) {
            cardarr[0].flowFee = Number(this.obj.unexefee).toFixed(2)
          } else {
            cardarr[0].flowFee = Number(val.allmoney) === 0 ? '' : Number(val.allmoney).toFixed(2)
          }
        } else {
          if (Number(val.memberCardShare.restShareMoney) >= Number(this.obj.unexefee)) {
            cardarr[0].flowFee = Number(this.obj.unexefee).toFixed(2)
          } else {
            cardarr[0].flowFee =
              Number(val.memberCardShare.restShareMoney) === 0
                ? ''
                : Number(val.memberCardShare.restShareMoney).toFixed(2)
          }
        }
      } else {
        if (Number(val.allmoney) >= this.obj.unexefee) {
          cardarr[0].flowFee = Number(this.obj.unexefee).toFixed(2)
        } else {
          cardarr[0].flowFee = Number(val.allmoney) === 0 ? '' : Number(val.allmoney).toFixed(2)
        }
      }
      this.limitDecimal(cardarr[0].flowFee, 0, 'isClick')
    },
    // 读到卡后验证此卡是否是本人的
    async checkcard () {
      if (this.iscarddisabled) {
        return
      }
      if (!this.checkdata) {
        this.$messageTips(this, 'error', '请刷卡')
        return
      }
      try {
        let params = {
          keyword: this.checkdata
        }
        let data = await searchFuzzy(params)
        if (
          data.data &&
          data.data.resultList &&
          data.data.resultList.length === 1
        ) {
          if (
            (data.data.resultList[0].patientOrg &&
              data.data.resultList[0].patientOrg.patientId) ===
            (this.obj.patientid || this.obj.patientId)
          ) {
            this.iscardcheck = false
          } else {
            this.$messageTips(this, 'error', '此就诊卡不是本人')
          }
        } else {
          this.$messageTips(this, 'error', '未查到此就诊卡')
        }
      } catch (err) { }
    },
    // 是否需要关闭前回调
    handleClose (done) {
      if (this.obj.iscallback) {
        this.$emit('closedialog', done)
      } else {
        this.v = false
      }
    },
    // 金额计算
    getfee (arr, type) {
      let result = ''
      if (type === 'add') {
        result = arr
          .reduce((total, cur) => {
            total += Number(cur)
            return total
          }, 0)
          .toFixed(2)
      } else {
        result = arr
          .reduce((total, cur, index) => {
            if (index === 0) {
              total = Number(cur)
            } else {
              total -= Number(cur)
            }
            return total
          }, arr[0])
          .toFixed(2)
      }
      // 0元挂号需要展示0元让他们点！！！！！！！！押金0元不展示0元他们嫌麻烦
      if (
        (Number(result) === 0 && Number(this.obj.unexefee) !== 0) ||
        (Number(result) === 0 && Number(this.obj.isDeposit) === 1)
      ) {
        return ''
      } else {
        return Number(result).toFixed(2)
      }
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
    // 获取会员卡
    getcard () {
      useraccountapi
        .getRcmUserCard(this.obj.patientid || this.obj.patientId)
        .then(r => {
          this.allgiftfee = 0
          this.allsharegifefee = 0
          if (r.head.errCode === 0) {
            if (r.data.length >= 0) {
              r.data.map(v => {
                if (v.memberCardShare) {
                  v.name = `${v.memberCardBatch.name}(共享卡)`
                  v.isShareCard = true
                  v.restShareMoney = v.memberCardShare.restShareMoney
                  this.allsharegifefee += v.restShareMoney
                } else {
                  v.name = v.memberCardBatch.name
                  v.isShareCard = false
                  v.restShareMoney = 0
                  this.allgiftfee +=
                    Number(v.storedMoney) + Number(v.givedMoney)
                }
              })
              // this.selectvalue = r.data.length > 0 ? r.data[0] : {}
              this.options = r.data
            }
          }
        })
    },
    // 找零逻辑
    chargeevent (fee) {
      let cashArr = this.feeList.filter(v => Number(v.payMethod === 1))
      if (cashArr.length > 0) {
        // 抹零带来的找零结果
        const roundFeeResult = this.roundFee > 0
          ? (this.receive - cashArr[0].flowFee)
          : this.roundFee === 0
            ? 0
            : -this.roundFee
        this.changeBack = this.receive - cashArr[0].flowFee - roundFeeResult
      }
      // 实收金额，要跟着抹零变化
      this.totalFeeActually = floatTool.subtract(this.getsum(this.feeList), this.roundFee)
    },
    mousewheelevent (event) {
      event = event || window.event
      event.preventDefault()
    },
    // keyup金额逻辑
    actions (fee, paymethod) {
      // 非会员卡逻辑
      const clickevent = (fee, paymethod) => {
        /* do sth */
        if (/^[+-]?\d*\.?\d{0,2}$/.test(fee)) {
        } else {
          fee = fee.substring(0, fee.length - 1)
          this.feeList.forEach(v => {
            Number(v.payMethod) === Number(paymethod)
              ? (v.flowFee = fee)
              : null
          })
        }
        // 是否走反算流程
        if (this.obj.backCalculation === false) {
          this.chargeevent()
          return
        }
        let notfaultArr = this.feeList.filter(v => !v.defaultChargeMethod)
        let nottotalfee = this.getsum(notfaultArr)
        let islastfee =
          this.obj.unexefee - nottotalfee === 0
            ? ''
            : (this.obj.unexefee - nottotalfee).toFixed(2)
        this.feeList.map(v => {
          if (v.defaultChargeMethod && v.payMethod !== paymethod) {
            v.flowFee = islastfee
          }
        })
        this.getCash()
        this.chargeevent()
      }
      // 会员卡逻辑
      const cardevent = (fee, paymethod) => {
        let cardfeeArr = this.feeList.filter(v => v.payMethod === paymethod)
        let cardFee = cardfeeArr[0].flowFee
        if (
          !this.obj.isRefund &&
          (Number(cardFee) > Number(this.obj.unexefee)) &&
          (this.obj.unexefee > 0)
        ) {
          // cardfeeArr[0].flowFee = ''
          this.$messageTips(this, 'error', '会员卡支付金额不能大于还需支付')
          clickevent(fee, paymethod)
          return
        }
        // 收费，(非共享卡会员卡)余额小于应收金额
        if (
          !this.obj.isRefund &&
          !this.usercardinfo.isShareCard &&
          this.obj.unexefee > 0
        ) {
          // 输入金额大于会员卡可用余额
          if (Number(cardFee) > Number(this.usercardinfo.allmoney)) {
            cardfeeArr[0].flowFee = ''
            this.$messageTips(this, 'error', '会员卡支付金额不能可用余额')
            clickevent(fee, paymethod)
            return
          }
        }
        // 共享卡
        if (!this.obj.isRefund && this.usercardinfo.isShareCard) {
          // 共享额度大于等于余额
          if (Number(this.usercardinfo.restShareMoney) >= Number(this.usercardinfo.allmoney)) {
            // 金额不能超过共享额度
            if (Number(cardFee) > Number(this.usercardinfo.allmoney)) {
              cardfeeArr[0].flowFee = ''
              clickevent(fee, paymethod)
              this.$messageTips(this, 'error', '会员卡支付金额不能大于其可用金额')
              return
            }
          } else {
            // 共享额度小于余额金额不能超过余额
            if (Number(cardFee) > Number(this.usercardinfo.restShareMoney)) {
              cardfeeArr[0].flowFee = ''
              this.$messageTips(this, 'error', '共享余额不足')
              clickevent(fee, paymethod)
              return
            }
          }
        }

        clickevent(fee, paymethod)
      }
      return new Map([
        [/^isClick_([1-9]|(1[0-9])|(2[0-9]))$/, clickevent],
        [/^isClick_[0]$/, cardevent]
      ])
    },

    // 保留两位小数
    limitDecimal (fee, paymethod, isClick) {
      let action = [...this.actions()].filter(([key, value]) =>
        key.test(`${isClick}_${String(paymethod)}`)
      )
      action.forEach(([key, value]) => value.call(this, fee, paymethod))
    },
    // 蓝色可点击
    clearclick (list) {
      if (!list.clearChargeMethod) {
        return
      }
      // 现金支付
      let notfaultArr = this.feeList.filter(
        v => !v.clearChargeMethod && v.payMethod !== list.payMethod
      )
      let lsfaultArr = this.feeList.filter(
        v => v.clearChargeMethod && v.payMethod !== list.payMethod
      )
      let nottotalfee = this.getsum(notfaultArr)
      let lstotalfee = this.getsum(lsfaultArr)
      this.feeList.map(v => {
        if (v.clearChargeMethod && v.payMethod !== list.payMethod) {
          v.flowFee = ''
        }
        let islastfee = 0
        if (this.obj.backCalculation === false) {
          islastfee = lstotalfee.toFixed(2)
        } else {
          islastfee = this.getfee(
            [this.obj.unexefee, nottotalfee],
            'less'
          )
        }
        v.payMethod === list.payMethod
          ? (v.flowFee = this.getfee([islastfee], 'add'))
          : null
      })
      this.getCash()
      this.chargeevent()
    },
    // 支付方式获取
    async payList () {
      this.obj.loading = true
      this.payLoading = true
      try {
        let params = {
          // 住院支付方式类型
          type: this.obj.payType
        }
        let data = await getPayment(params)
        this.obj.loading = false
        if (data && data.data) {
          if (this.obj.isDeposit) {
            this.obj.paymethodArr = data.data.default.filter(
              v => v.value !== 15
            )
          } else {
            this.obj.paymethodArr = data.data.default.filter(
              v => v.value !== 14
            )
          }
          this.obj.paymethodArr.forEach(v => {
            this.feeList.push({
              payMethod: v.value,
              flowFee: '',
              remark: '',
              name: v.name,
              defaultChargeMethod: v.defaultChargeMethod,
              clearChargeMethod: v.clearChargeMethod
            })
          })
        } else {
        }
        this.payLoading = false
      } catch (err) {
        this.obj.loading = false
        this.payLoading = false
        console.log(err)
      }
    },
    // 挂单金额
    pendingorderTotal () {
      let sum = 0
      for (var v in this.obj.recDetails) {
        sum += this.obj.recDetails[v] || 0
      }
      return sum
    },
    // 删除支付流水
    undo (row) {
      this.$confirm('确认作废此支付流水？').then(async _ => {
        this.obj.loading = true
        this.payLoading = true
        try {
          let params = {
            id: row.id
          }
          let data = await cancel(params)
          this.obj.loading = false
          this.payLoading = false
          if (data && data.data) {
            this.$emit('refundstatus')
          }
        } catch (err) {
          this.obj.loading = false
          this.payLoading = false
        }
      })
    },
    pay () {
      // 检测是否有使用预授权
      let checkresult = this.checkAuthorizeFee()
      if (!checkresult) {
        return false
      }
      if (this.obj.isDeposit) {
        let feeListBelowZero = this.feeList.filter(v => v.flowFee !== '').some(item => Number(item.flowFee) <= 0)
        if (feeListBelowZero) {
          this.$messageTips(this, 'error', '补缴押金必须每一项都大于0，请修改金额')
          return false
        }
      }
      if (!this.obj.isDeposit && this.obj.sbskType === undefined) {
        if (floatTool.subtract(Number(Number(this.obj.unexefee).toFixed(2)), this.roundFee) !== Number(this.totalFeeActually)) {
          this.$messageTips(this, 'error', '支付金额不等于还需支付金额')
          return false
        }
      }

      // 挂单流水需要放在最后一个
      // 提交时，如果现金框里有值，现金的实际支付金额，是现金框里的金额，减去找零
      let data = this.feeList.filter(v => Number(v.payMethod) !== 7 && Number(v.payMethod) !== 8 && Number(v.payMethod) !== 1)
      let cash = this.feeList.filter(v => Number(v.payMethod) === 1)
      if (
        cash.length > 0 &&
        Number(this.receive) < floatTool.subtract(Number(cash[0].flowFee), this.roundFee) &&
        !this.obj.isRefund
      ) {
        this.$messageTips(this, 'error', '接收金额不能小于现金输入金额！')
        return false
      }
      // 退费支付页，备注不能为空
      if (this.obj.isRefund && !this.remark) {
        this.$messageTips(this, 'error', '退费支付页备注不能为空')
        return false
      }
      let casharr = this.feeList.filter(v => Number(v.payMethod) === 1)
      let deepclonecashar = JSON.parse(JSON.stringify(casharr))
      let newxjarr = []
      if (this.roundFee > 0 || this.roundFee < 0) {
        // 抹零，支付方式统计为现金，wipeOff标识是否是抹零
        newxjarr[0] = {
          name: '抹零',
          payMethod: 1,
          flowFee: this.roundFee,
          wipeOff: 1 // 抹零标识
        }
        if (deepclonecashar.length > 0) {
          deepclonecashar[0].flowFee = floatTool.subtract(deepclonecashar[0].flowFee, this.roundFee).toFixed(2)
        }
      } else {
        newxjarr = []
      }
      // 会员卡支付逻辑
      data.map(v => {
        if (Number(v.payMethod) === 0) {
          v.cardId = this.usercardinfo.id
        }
        if (Number(v.payMethod) === 1) {
          v.cashReceiveAmount = this.receive
        }
      })
      let pendingData = this.feeList.filter(
        v => v.payMethod === 7 || v.payMethod === 8
      )
      let newfeeList = JSON.parse(
        JSON.stringify([].concat(newxjarr, deepclonecashar, data, pendingData))
      )
      // 将所有支付方式的备注都改成总体备注
      for (let item of newfeeList) {
        item.remark = this.remark
      }
      let confirmarr = newfeeList.filter(
        v => v.flowFee < 0 && Number(v.payMethod) !== 19 && !v.wipeOff
      )
      if (confirmarr.length > 0) {
        this.$confirm(
          confirmarr[0].name + '支付方式存在负数, 是否继续支付?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            this.payrule(newfeeList)
          })
          .catch(() => { })
      } else {
        this.payrule(newfeeList)
      }
    },
    async payrule (newfeeList) {
      this.payLoading = true
      this.obj.loading = true
      this.isSureLoading = true
      let params = {
        // 患者id
        patientId: this.obj.patientid || this.obj.patientId,
        // 结算id
        settlementId: this.obj.id,
        // 结算单号
        settlementNo: this.obj.settleCode,
        // 异步挂号传visitNumber
        rootOrderId: this.obj.visitNumber ? this.obj.visitNumber : '',
        huanhaoOrderId: this.obj.huanhaoOrderId ? this.obj.huanhaoOrderId : '',
        // 类型1门诊2住院3商城
        type: Number(this.obj.payType) === 4 ? 1 : this.obj.payType,
        // 商保应收个人是付款还是退款
        sbskType: this.obj.sbskType,
        feeList: newfeeList.filter(v => v.flowFee !== ''),
        isDeposit: this.obj.isDeposit ? this.obj.isDeposit : 0,
        refundTag: this.obj.isRefund ? this.obj.isRefund : false,
        givedMoneyGH: this.obj.givedMoneyGH || 0,
        scenes: this.obj.scenes || '', // 入院登记支付之前入院申请单被删除的情况
        macId: this.macId  // 医保结算时机后移至结算之前了
      }
      Object.keys(params).forEach(key => {
        params[key] === '' ? delete params[key] : null
      })
      try {
        let data = await createFlow(params)
        if (data && data.data && data.data.tradeSuccess) {
          this.v = false
          this.$emit('payStatus')
        }
        this.payLoading = false
        this.isSureLoading = false
        this.obj.loading = false
      } catch (err) {
        this.payLoading = false
        this.isSureLoading = false
        this.obj.loading = false
        console.log(err)
      }
    },
    cancel () {
      this.$emit('cancel')
    },
    // 针对预授权进行校验
    checkAuthorizeFee () {
      for (let item of this.feeList) {
        if (item.payMethod === 14) {
          // 如果是14，代表是预授权
          if (this.obj.unexefee >= 0) {
            // 如果是交押金，押金金额不大于100000
            if (item.flowFee > 100000) {
              // this.$message.error('授权权刷卡不能大于100000')
              this.$messageTips(this, 'error', '预授权刷卡不能大于100000')
              return false
            }
          }
        }
        if (item.payMethod === 15) {
          if (Math.abs(item.flowFee) > Number(this.obj.authrizeFee)) {
            // this.$message.error('消除预授权不能大于已使用预授权总额')
            this.$messageTips(this, 'error', '消除预授权不能大于已使用预授权总额')
            return false
          }
        }
      }
      return true
    }
  }
}
</script>
<style scoped>
.settle_fee {
  padding: 0 0px;
  background: #f4f4f4;
  margin: 0 0px;
  line-height: 50px;
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
.settle_fee .label_dis_need {
  font-size: 20px;
  color: #000;
  font-weight: 500;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 30px;
  color: #ff9c00;
  vertical-align: middle;
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
  font-size: 25px;
  color: #ff9c00;
  font-weight: 500;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 30px;
  color: #ff9c00;
  vertical-align: middle;
}
.settle_paymethod {
  margin-top: 20px;
  padding: 0 20px;
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
  width: auto;
  overflow-x: scroll;
  clear: both;
}
.paymethod_pay_item {
  margin-top: 30px;
  margin-right: 40px;
  margin-bottom: 15px;
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
  /* background: #f8f8f8;
  border: 1px solid #ddd; */
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
.paymethodList {
  min-height: 40px;
}
.paymethod_con1 {
  vertical-align: middle;
  color: #666;
  padding-bottom: 15px;
  font-size: 14px;
}
.paymethod_con1 .el-input {
  margin-left: 10px;
  display: inline-block;
  width: 150px;
  color: #000;
}
.paymethod_con1 .el-input__inner {
  width: 150px;
  height: 36px;
}
.otherPaymethod .el-input {
  width: 200px;
}
.paymethod_con1 .el-input {
  width: 200px;
}
.otherPaymethod .el-input__inner {
  width: 200px;
}
.paymethod_con_label {
  font-size: 14px;
  color: #000;
}
.paymethod_con_money {
  margin-right: 20px;
  font-size: 18px;
  color: #000;
  font-weight: 400;
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
.settle_paymethod.paymethod_pay .paymethod_pay_item_box {
  overflow-y: auto;
}
.paytwo /deep/ .el-dialog__footer {
  border-top: 1px solid #dddddd;
}
.paytwo /deep/ .el-dialog__body {
  padding: 0;
}
.scoll {
  max-height: 500px;
  overflow-y: scroll;
}
.colorRed {
  margin-right: 10px;
  font-size: 16px;
  color: #ff9c00;
}
.paymethodunitbehind {
  line-height: 36px;
  text-align: left;
}
.paymethodunit {
  text-align: right;
}
.paymethodlabel {
  text-align: right;
  font-size: 14px;
  line-height: 33px;
  color: #000;
  font-weight: bold;
}
.remark {
  line-height: 44px;
  margin-bottom: 12px;
}
.remark .label {
  float: left;
  width: 138px;
  font-size: 14px;
  color: #000;
  font-weight: bold;
  text-align: right;
  padding-right: 12px;
}
.remark .remarkcontent {
  float: left;
  width: 1040px;
}
.isclick {
  color: #000;
}
.clearfix {
  clear: both;
}
.paytwo /deep/ input::-webkit-outer-spin-button,
.paytwo /deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.paytwo /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.his {
  width: 15%;
  float: left;
}
.textlabel {
  text-align: right;
  margin-right: 10px;
}
.paytwo /deep/ .el-input__suffix {
  line-height: 36px;
  color: #666;
}
.feelist {
  padding: 0;
  margin: 0;
}
.feelist li {
  float: left;
  padding: 0 20px;
  line-height: 50px;
  height: 50px;
  text-align: center;
}
.brright {
  color: #bbbbbb;
  margin-left: 20px;
}
.bfont {
  font-size: 20px;
}
.receive {
  cursor: pointer;
}
.chargefee {
  color: #f27700;
  font-weight: 500;
}
.getvalue {
  color: #1c7bef;
  font-weight: 500;
  font-size: 14px;
  font-family: sans-serif;
  font-style: inherit;
  cursor: pointer;
  padding: 0 5px;
}
.remarkicon:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.remarbg /deep/ .el-textarea__inner {
  background: #fef5be !important;
}
.icon-menzhen-shoufei-yanz {
  font-size: 18px;
}
.paytwo /deep/ .his {
  width: 15%;
  float: left;
}
</style>
