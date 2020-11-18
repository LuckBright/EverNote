<template>
  <div class='setHover'>
    <div class="layout_inner settle_fee" style="margin-top: 20px;" v-show="obj.settlestatus !== '3' && obj.settlestatus !== '4' && obj.settlestatus !== '5'">
      <el-row>
        <el-col :span="6">
          <span class="label_name">总额：</span>
          <span class="label_money">￥{{obj.totalPayedFee | formatToFinacial}}</span>
        </el-col>
        <el-col :span="6">
          <span class="label_name">已收金额：</span>
          <span class="label_money">￥{{obj.exefee | formatToFinacial}}</span>
        </el-col>
        <el-col :span="6">
          <span class="label_name">挂单金额：</span>
          <span class="label_money">￥{{pendingorderTotal() | formatToFinacial}}</span>
        </el-col>
        <el-col :span="6">
          <span class="label_name">还需支付：</span>
          <span class="label_pay">￥{{(obj.totalPayedFee || 0) - (obj.exefee || 0) - pendingorderTotal() | formatToFinacial}}</span>
        </el-col>
      </el-row>
    </div>
    <div class="layout_inner settle_paymethod" v-bind:class="{settleaccountpad: obj.settlestatus!=='1' && obj.settlestatus!=='2'}" style="margin-top: 20px;">
      <div class="settlepaymentbox" v-show="(businessCode === '' || $route.query.taskId) &&  obj.settlestatus !== '3' && obj.settlestatus !== '4' && obj.settlestatus !== '5'">
        <h4 class="settle_paymethod_title">{{obj.settlestatus === '1' ? '支付选择' : '挂单支付'}}</h4>
        <el-menu mode="horizontal" class="settle_paymethod_tab" :default-active="activeIndex" @select="handleSelect" v-show="obj.settlestatus === '1' && !$route.query.taskId">
          <el-menu-item index="1">
            支付方式
          </el-menu-item>
          <el-menu-item index="2" v-if="pendingorderArr && pendingorderArr[0]">
            挂单
          </el-menu-item>
        </el-menu>
        <!-- <el-menu mode="horizontal" class="settle_paymethod_tab" :default-active="activeIndex" @select="handleSelect" v-show="obj.settlestatus === '4' && !$route.query.taskId">
          <el-menu-item index="1">
            默认退款
          </el-menu-item>
          <el-menu-item index="2">
            特殊退款
          </el-menu-item>
        </el-menu> -->
        <div class="paymethod_pay" v-show="activeIndex === '1'">
          <div class="paymethod_pay_item_box">
            <template v-for="item in paymethodArr">
              <div class="paymethod_pay_item" :class="{active: obj.payObj.paymethod === item.value}" @click="selectmethod(item)" v-if="item.value === '1' || item.value === '2' || item.value === '9'">
                <span v-if="item.value === '1'">
                  <i class="iconfont icon-cash iconfont1"></i> {{item.name}}</span>
                <span v-if="item.value === '2'">
                  <i class="iconfont icon-card iconfont2"></i> {{item.name}}</span>
                <span v-if="item.value === '9'">
                  <i class="iconfont icon-QR iconfont9"></i> {{item.name}}</span>
                <i class="iconfont icon-Selected" v-show="obj.payObj.paymethod === item.value"></i>
              </div>
              <div class="paymethod_pay_item" @click="toweixinpay(item.value)" v-if="item.value === '3' || item.value === '4'">
                <span v-if="item.value === '3'">
                  <i class="iconfont icon-alipay iconfont3"></i> {{item.name}}</span>
                <span v-if="item.value === '4'">
                  <i class="iconfont icon-wechat iconfont4"></i> {{item.name}}</span>
              </div>
              <div class="paymethod_pay_item paymethod_pay_item_noicon" :class="{active: obj.payObj.paymethod === item.value}" @click="selectmethod(item)" v-if="item.value !== '3' && item.value !== '4' && item.value !== '1' && item.value !== '2' && item.value !== '9'">
                {{item.name}}
                <i class="iconfont icon-Selected" v-show="obj.payObj.paymethod === item.value"></i>
              </div>
            </template>
          </div>
          <div class="paymethod_con" style="clear: both;">
            <div class="paymethod_con_money" style="float: left;" v-show="obj.payObj.paymethod === '9'">
              实收金额
              <el-input placeholder="请填写金额" type="number" v-model="obj.payObj.qrfee" :disabled="obj.payObj.paymethod === '9'"></el-input>
            </div>
            <div class="paymethod_con_money" style="float: left;" v-show="obj.payObj.paymethod !== '9'">
              实收金额
              <el-input placeholder="请填写金额" type="number" v-model="obj.payObj.flowfee"></el-input>
            </div>
            <div class="paymethod_con_money" style="float: left;" v-if="obj.payObj.paymethod === '9'">
              授权码
              <el-input v-focus="obj.payObj.paymethod === '9'" placeholder="请扫码" type="number" v-model="obj.payObj.auth_code"></el-input>
            </div>
            <div class="paymethod_con_backmoney" style="float: left;" v-if="obj.payObj.paymethod === '1'">
              找零金额：
              <span>￥{{oddchange() | formatToFinacial}}</span>
            </div>
            <div class="paymethod_con_money" style="float: left;">
              备注
              <el-input placeholder="请填写备注" v-model="obj.payObj.remark"></el-input>
            </div>
            <el-button style="float: left;" type="primary" @click="pay" v-loading='payLoading'>确认支付</el-button>
          </div>
        </div>
        <div class="paymethod_pay" v-show="activeIndex === '2'">
          <div class="paymethod_pay_item_box">
            <div class="paymethod_pay_item paymethod_pay_item_noicon" :class="{active: obj.payObj.paymethod === item.value}" v-for="item in pendingorderArr" @click="selectmethod(item)">
              {{item.name}}
              <i class="iconfont icon-Selected" v-show="obj.payObj.paymethod === item.value"></i>
            </div>
          </div>
          <div class="paymethod_con" style="clear: both;">
            <div class="paymethod_con_money" style="float: left;">
              挂单金额
              <el-input placeholder="请填写金额" v-model="obj.payObj.flowfee" disabled></el-input>
            </div>
            <el-button style="float: left;" type="primary" @click="pay" :disabled="businessCode !== '' && !$route.query.taskId">确认挂单</el-button>
          </div>
        </div>
      </div>
      <div class="buttonbox" v-show="businessCode !== '' && !$route.query.taskId && obj.settlestatus !== '3'" style="position: relative; height: 40px;">
        <el-button type="primary" style="height: 40px; width: 88px; position:absolute; left: 50%; margin-left: -44px;" @click="jumptotask">审批详情</el-button>
      </div>
      <div v-if="!$hasPermission('Auth_menu_rcm_settlements_specialrefund')||($hasPermission('Auth_menu_rcm_settlements_specialrefund')&&obj.settlestatus !=4)">
        <h4 class="settle_paymethod_title">支付记录</h4>
        <el-table style="width:100%" :data="obj.payTradeLog" border>
          <el-table-column prop="payName" label="支付方式">
          </el-table-column>
          <el-table-column prop="payTime" label="支付时间">
          </el-table-column>
          <el-table-column prop="flowFee" label="支付金额">
            <template slot-scope="scope">
              {{scope.row.flowFee | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column prop="payStatus" label="状态">
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="danger" size="small" @click="undo(scope.row.id)" :disabled="scope.row.payState === 3 || scope.row.paymethod==='0' || obj.settlestatus === '4' || obj.settlestatus === '5'" v-if="$hasPermission('Auth_rcm_settlements_paylist_cancelBtn')">作废</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" v-if="$hasPermission('Auth_menu_rcm_settlements_specialrefund')&&obj.settlestatus ==4">
        <el-tab-pane label="默认退款" name="first">
          <el-table style="width:100%" :data="obj.payTradeLog" border>
            <el-table-column prop="payName" label="支付方式">
            </el-table-column>
            <el-table-column prop="payTime" label="支付时间">
            </el-table-column>
            <el-table-column prop="flowFee" label="支付金额">
              <template slot-scope="scope">
                {{scope.row.flowFee | formatToFinacial}}
              </template>
            </el-table-column>
            <el-table-column prop="payStatus" label="状态">
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="danger" size="small" @click="undo(scope.row.id)" :disabled="scope.row.payState === 3 || scope.row.paymethod==='0' || obj.settlestatus === '4' || obj.settlestatus === '5'" v-if="$hasPermission('Auth_rcm_settlements_paylist_cancelBtn')">作废</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="特殊退款" name="second">
          <el-button type="primary" size="small" @click='refundAddBtn' :disabled='!obj.id || obj.verifyStatus!==0'>新建</el-button>
          <el-table style="width:100%" :data="refundTable" border>
              <el-table-column prop="paymethod" label="支付方式">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.paymethod" placeholder="请选择" :disabled="!scope.row.isSave">
                    <el-option v-for="item in newPaymethodArr" :key="item.id" :label="item.name" :value="item.value" :disabled="item.value==7 || item.value==0">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            <el-table-column prop="createTime" label="支付时间">
            </el-table-column>
            <el-table-column prop="flowfee" label="支付金额">
              <template slot-scope="scope">
                <el-input v-model="scope.row.flowfee" placeholder="请输入内容" v-if='scope.row.isSave'></el-input>
                <span v-if='!scope.row.isSave'>{{scope.row.flowfee}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="payState" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.payState === 0 ? '待退费':'已退费'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="refundSaveBtn(scope.row)" v-if='scope.row.isSave' :disabled='!obj.id || obj.verifyStatus !==0'>保存</el-button>
                <el-button type="primary" size="small" @click="refundCancelBtn(scope.row,scope.$index)" v-if='scope.row.isSave&&scope.row.id' :disabled='!obj.id || obj.verifyStatus!==0'>取消</el-button>
                <el-button type="primary" size="small" @click="refundEditBtn(scope.row)" v-if='!scope.row.isSave' :disabled='!obj.id || obj.verifyStatus!==0 || scope.row.isSourceMember'>编辑</el-button>
                <el-button type="primary" size="small" @click="refundDelBtn(scope.row,scope.$index)" v-if='!scope.row.isSave || !scope.row.id' :disabled='!obj.id || obj.verifyStatus!==0 || scope.row.isSourceMember'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
// import sysvalue from '../../warehouse/store/sysvalueapi.js' // 2018.7.9 支付方式 由值集改成接口
// import receipt from '../store/receiptflowapi' // 退费接口换 2018.7.9
import settleapi from '../store/settlepaymentapi'
// import payapi from '../store/weixinpayapi' // 2018.7.9 支付方式 由值集改成接口
// import returnapi from '../store/paymentreturnapi' // 2018.7.9 流水从结算取
// import progressapi from '../../warehouse/store/progressapi' // 2018.7.9 挂单审批暂时废弃
import { Notification } from 'element-ui'
export default {
  props: ['obj'],
  data () {
    return {
      payLoading: false,
      // 退款方式可选
      sourcerefundTable: [],
      refundTable: [],
      activeName: 'first',
      activeIndex: '1',
      money: 0,
      businessCode: '',
      // payedList: [],
      pendingorderArr: [],
      paymethodArr: [],
      newPaymethodArr: [],
      otherArr: [],
      receiptId: ''
      // verifyStatusStr: {
      //   '0': '新建',
      //   '1': '审批中',
      //   '2': '审批通过',
      //   '3': '驳回'
      // }
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
    getRefundList () {
      settleapi
        .getRefundFlowsBySettlementId(this.obj.settlementid)
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
    // 退款方式可选逻辑
    refundAddBtn () {
      this.refundTable.push({
        paymethod: '',
        // payTime: this.$moment(new Date()).format('YYYY-MM-DD'),
        flowFee: '',
        payState: 0,
        isSave: true
      })
    },
    refundSaveBtn (row) {
      if (row.id) {
        let params = {
          id: row.id,
          patientid: this.obj.patientid, // 患者id
          settlementid: this.obj.id, // 退费单id
          paymethod: row.paymethod, // 支付方式
          flowfee: row.flowfee // 退费金额
        }
        settleapi
          .update(params)
          .then(data => {
            if (data && data.head.errCode === 0) {
              this.getRefundList()
            }
          })
          .catch()
      } else {
        let params = {
          patientid: this.obj.patientid, // 患者id
          settlementid: this.obj.id, // 退费单id
          paymethod: row.paymethod, // 支付方式
          flowfee: row.flowfee // 退费金额
        }
        settleapi
          .createRefundFlow(params)
          .then(data => {
            if (data && data.head.errCode === 0) {
              this.getRefundList()
            }
          })
          .catch()
      }
      row.isSave = false
    },
    refundCancelBtn (row, index) {
      this.refundTable[index].flowfee = this.sourcerefundTable[index].flowfee
      this.refundTable[index].paymethod = this.sourcerefundTable[index].paymethod
      row.isSave = true
    },
    refundEditBtn (row) {
      row.isSave = true
    },
    refundDelBtn (row, index) {
      if (row.id) {
        settleapi
          .deleteRefundFlow(row.id)
          .then(data => {
            if (data && data.head.errCode === 0) {
              this.getRefundList()
            }
          })
          .catch()
      } else {
        this.refundTable.splice(index, 1)
      }
    },
    handleClick (tab, event) {
      if (tab.name === 'second') {
        this.obj.refundStatus = 1
        this.getRefundList()
      } else {
        this.obj.refundStatus = 0
      }
    },
    oddchange () {
      let that = this
      let odd = 0.0
      if (that.obj.settlestatus === '2') {
        odd =
          that.obj.payObj.flowfee - that.pendingorderTotal() > 0
            ? that.obj.payObj.flowfee - that.pendingorderTotal()
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
      if (that.obj.settlestatus === '2') {
        needtopay = that.pendingorderTotal()
      } else {
        needtopay = (
          (that.obj.totalPayedFee || 0) -
          (that.obj.exefee || 0) -
          that.pendingorderTotal()
        ).toFixed(2)
      }
      return needtopay
    },
    // createVerify () { // 原挂单审批流程，现废弃，但保留代码 2018.07.09
    //   let that = this
    //   that.obj.loading = true
    //   receipt.createVerify({
    //     patientid: that.$route.query.pid,
    //     settlementid: that.$route.query.sid,
    //     paymethod: that.obj.payObj.paymethod,
    //     settleCode: that.obj.settlecode,
    //     flowfee: that.obj.payObj.flowfee,
    //     receivableId: that.obj.receivableid,
    //     businessCode: that.businessCode,
    //     id: that.receiptId
    //   }).then(result => {
    //     that.obj.loading = false
    //     if (result.head.errCode === 0) {
    //       if (that.$route.query.taskId) {
    //         that.obj.loading = true
    //         progressapi.finish({
    //           processData: {
    //             taskId: that.$route.query.taskId,
    //             amount: parseFloat(that.obj.payObj.flowfee)
    //           }
    //         }).then(result => {
    //           that.obj.loading = false
    //           that.$emit('getData')
    //           // that.receiptlist()
    //           that.$router.push('/rcm/settleaccount?pid=' + that.$route.query.pid + '&rid=' + that.$route.query.rid + '&sid=' + that.$route.query.sid + '&status=1')
    //         }, errorFn => {
    //           that.obj.loading = false
    //         })
    //       } else {
    //         that.obj.loading = true
    //         receipt.pendingOrderVerify({
    //           rootorderid: that.$route.query.rid,
    //           patientid: that.$route.query.pid,
    //           settleCode: that.obj.settlecode,
    //           businessCode: result.data.businessCode,
    //           settlementid: that.$route.query.sid,
    //           id: result.data.id,
    //           flowfee: that.obj.payObj.flowfee
    //         }).then(result => {
    //           that.obj.loading = false
    //           // that.businessCode = result.data.businessCode
    //           that.$emit('getData')
    //           // that.receiptlist()
    //         }, errorFn => {
    //           that.obj.loading = false
    //         })
    //       }
    //     }
    //   })
    // },
    // receivableFlow () { // 原挂单审批流程，现废弃，但保留代码 2018.07.09
    //   let that = this
    //   if (that.$route.query.taskId) {
    //     that.obj.loading = true
    //     receipt.pendingOrderResults({
    //       verifyStatus: 3,
    //       id: that.receiptId
    //     }).then(response => {
    //       that.obj.loading = false
    //       that.createVerify()
    //     }, errorFn => {
    //       that.obj.loading = false
    //     })
    //   } else {
    //     that.createVerify()
    //   }
    // },
    undo (id) {
      let that = this
      that.$confirm('确认作废此支付流水？').then(_ => {
        that.loading = true
        settleapi.del(id).then(
          result => {
            that.loading = false
            if (result.head.errCode === 0) {
              that.$emit('getData')
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
    // getReceiptFlows () { // 支付流水在结算单接口里面取 2018.7.9
    //   let that = this
    //   returnapi.getReceiptFlows({
    //     refundId: that.obj.settlementid,
    //     reSettleId: that.obj.reSettleId
    //   }).then(result => {
    //     result.data.forEach(function (item) {
    //       item.canclick = true
    //       item.paymethod = item.paymethod.toString()
    //     })
    //     that.payedList = result.data
    //   })
    // },
    // receiptlist () { // 支付流水在结算单接口里面取 2018.7.9
    //   let that = this
    //   that.obj.loading = true
    //   receipt.list(this.obj.settlementid).then(result => {
    //     that.obj.loading = false
    //     result.data.forEach(function (item) {
    //       item.canclick = false
    //       item.paymethod = item.paymethod.toString()
    //       item.verifyStatus = item.verifyStatus.toString()
    //       if (item.verifyStatus === '1') {
    //         item.canclick = true
    //         that.businessCode = item.businessCode
    //         that.receiptId = item.id
    //       } else if (item.verifyStatus === '3') {
    //         item.canclick = true
    //       }
    //     })
    //     this.payedList = result.data
    //   }, errorFn => {
    //     that.obj.loading = false
    //   })
    // },
    polling (flowNumber, num, callback) {
      this.time = setInterval(() => {
        num--
        if (num <= 0) {
          // this.payLoading = false
          this.$message({
            message: '未支付成功',
            type: 'error'
          })
          clearInterval(this.time)
          return
        }
        this.payLoading = true
        settleapi.query({flowNumber}).then(v => {
          console.log(num)
          if (v && v.data && v.data.tradeSuccess === true) {
            this.payLoading = false
            this.$message({
              message: '支付成功',
              type: 'success'
            })
            callback()
            clearInterval(this.time)
          }
        }).catch(err => {
          this.payLoading = false
          this.$message({
            message: '未支付成功',
            type: 'error'
          })
          clearInterval(this.time)
          console.log(err)
        })
      }, 1000)
    },
    pay () {
      if (this.payLoading) {
        return
      }
      let that = this
      let tosubmitfee = 0
      if (that.oddchange() > 0) {
        tosubmitfee = (
          (that.obj.totalPayedFee || 0) -
          (that.obj.exefee || 0) -
          that.pendingorderTotal()
        ).toFixed(2)
      } else {
        tosubmitfee = that.obj.payObj.flowfee
      }
      if (
        that.obj.payObj.paymethod === '9' &&
        (!that.obj.payObj.auth_code || that.obj.payObj.auth_code === '')
      ) {
        Notification.error('请扫码')
        return false
      }
      that.obj.loading = true
      settleapi
        .tradeCreate({
          patientId: that.obj.patientid,
          settlementId: that.obj.settlementid,
          settlementNo: that.obj.settlecode,
          type: 1,
          feeList: [{
            payMethod: Number(that.obj.payObj.paymethod),
            flowFee: tosubmitfee,
            remark: that.obj.payObj.remark
          }],
          authCode: that.obj.payObj.auth_code
        })
        .then(
          result => {
            if (result.data && result.data.code && result.data.polling) {
              that.obj.loading = false
              let params = {
                payTp: Number(that.obj.payObj.paymethod),
                amt: tosubmitfee,
                orderNo: result.data.code
              }
              settleapi.serial(params).then(v => {
                this.polling(result.data.code, 45, () => {
                  that.$emit('getData')
                }).catch(err => {
                  console.log(err)
                })
              })
            } else {
              that.obj.loading = false
              that.$emit('getData')
            }
          },
          errorFn => {
            that.obj.loading = false
          }
        )
    },
    pendingorderTotal () {
      let sum = 0
      for (var v in this.obj.recDetails) {
        sum += this.obj.recDetails[v] || 0
      }
      return sum
    },
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
    toweixinpay (paymethod) {
      let that = this
      that.$router.push(
        '/rcm/weixinpay?settleCode=' +
          that.obj.settlecode +
          '&patientid=' +
          that.obj.patientid +
          '&settlementid=' +
          that.obj.settlementid +
          '&paymethod=' +
          paymethod +
          '&flowfee=' +
          that.obj.payObj.flowfee +
          '&receivableid=' +
          that.obj.receivableid
      )
    },
    selectmethod (obj) {
      let that = this
      if (obj.value === '9') {
        that.obj.payObj.qrfee = that.changeflowfee()
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
      // console.log(key, keyPath)
    },
    paymethod (v) {
      let that = this
      if (v === '1' || v === '2') {
        // 支付方式 由值集换成接口 2018.7.9
        settleapi.payment(1).then(result => {
          if (result.head.errCode === 0) {
            let payArr = []
            if (v === '1') {
              payArr = result.data.default
            } else if (v === '2') {
              payArr = result.data.notrec
            }
            payArr.forEach(function (item) {
              item.value = item.value && String(item.value)
              if (item.receivable) {
                that.pendingorderArr.push(item)
              } else {
                that.paymethodArr.push(item)
              }
            })
          }
          that.obj.payObj.paymethod =
            that.paymethodArr &&
            that.paymethodArr.length &&
            that.paymethodArr[0].value
        })
      } else if (v === '4') {
        settleapi.payment(1).then(result => {
          if (result.head.errCode === 0) {
            this.paymethodArr = result.data.default
            this.newPaymethodArr = [...this.paymethodArr, {value: 0, name: '会员卡支付'}]
          }
        })
      }
    }
    // getPaymentList () { // 支付流水在结算单接口里面取 2018.7.9
    //   if (this.obj.settlementid && (this.obj.settlestatus === '4' || this.obj.settlestatus === '5')) {
    //     this.getReceiptFlows()
    //   } else if (this.obj.settlestatus !== '0' && this.obj.settlestatus !== '4' && this.obj.settlestatus !== '5') {
    //     this.receiptlist()
    //   }
    // }
  },
  created () {
    let that = this
    this.paymethod(this.$route.query.status)
    this.obj.settlestatus = this.$route.query.status
    if (this.$route.query.taskId) {
      this.activeIndex = '2'
      this.obj.payObj.paymethod =
        that.pendingorderArr &&
        that.pendingorderArr.length &&
        that.pendingorderArr[0].value
    }
  },
  watch: {
    '$route.query.status' (v) {
      let that = this
      that.obj.settlestatus = v
      if (v === '1' || v === '2') {
        that.paymethod(v)
        that.money = 0
        that.payedList = []
        that.pendingorderArr = []
        that.paymethodArr = []
        that.otherArr = []
      }
    },
    '$route.query.taskId' (v) {
      let that = this
      if (v) {
        this.activeIndex = '2'
        this.obj.payObj.paymethod =
          that.pendingorderArr &&
          that.pendingorderArr.length &&
          that.pendingorderArr[0].value
      }
    }
  }
}
</script>
<style scoped>


.layout_box .layout_inner.settle_fee {
  padding: 0 20px 0; /* min-width: 1090px;*/
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
.layout_box .layout_inner.settle_paymethod.settleaccountpad {
  padding-bottom: 120px;
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
.paymethod_pay_item_box {
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: -1px;
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
  display: inline-block;
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
.paymethod_pay_item.active:before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  bottom: -17px;
  left: 50px;
  border-bottom: 6px solid #ddd;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}
.paymethod_pay_item.active:after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  bottom: -17px;
  left: 52px;
  border-bottom: 4px solid #f8f8f8;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
</style>
