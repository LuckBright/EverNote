<template>
  <div>
    <ever-bread-crumb :name="'订单详情'" :showTitle="'订单详情'" v-if="backtrack"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="order-module">
        <h3 class="f14">购买人信息</h3>
        <el-row>
          <el-col :span="4">
            <label>患者档案号：</label>
            {{tcInfo.patient && tcInfo.patient.patientNumber != 'temporary' ? tcInfo.patient.patientNumber : ''}}
          </el-col>
          <el-col :span="4">
            <label>姓名：</label>
            {{tcInfo.patient?tcInfo.patient.name:''}}
          </el-col>
          <el-col :span="4">
            <label>出生日期：</label>
            {{(tcInfo.patient && tcInfo.patient.birthday) ? tcInfo.patient.birthday.split(' ')[0] : ''}}
          </el-col>
          <el-col :span="4">
            <label>性别：</label>
            <sys-value type="GBT.2261.1" v-if="tcInfo.patient" :code="tcInfo.patient.sex"></sys-value>
          </el-col>
        </el-row>
      </div>
      <div class="order-module">
        <h3 class="f14">下单人信息</h3>
        <el-row>
          <el-col :span="4">
            <label>渠道类型：</label>
            {{tcInfo.channelName}}
          </el-col>
          <el-col :span="4">
            <label>下单人员：</label>
            {{tcInfo.saleManName}}
          </el-col>
          <!-- <el-col :span="8" class="date-col">
            <label>使用期限：</label>
            <el-date-picker
              v-model="tcInfo.limitUseDate"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd hh:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
            <el-button type="text" style="margin-left:10px;" @click="updateDate">修改</el-button>
          </el-col> -->
        </el-row>
      </div>
      <div class="order-module">
        <h3 class="f14">套餐信息</h3> 
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column prop="setMealName" label="名称"></el-table-column>
          <el-table-column prop="setMealTypeName" label="套餐类型" v-if="$route.meta.type !== 'plan'"></el-table-column>
          <el-table-column prop="itemNum" label="项目数量"></el-table-column>
          <el-table-column prop="totalPrice" label="原价金额">
            <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="totalPriceDis" label="折后金额">
            <template slot-scope="scope">{{scope.row.totalPriceDis | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="preferentialName" label="优惠名称" v-if="$route.meta.type !== 'plan'"></el-table-column>
          <el-table-column label="使用有效期至">
            <template slot-scope="scope">
            <el-row>
              <el-col :span="20">
                <date-picker
                  v-model="scope.row.limitUseDate"
                  outformat="yyyy-MM-dd HH:mm:ss"
                  :pickerOptions="pickerOptions"
                >
                </date-picker>
              </el-col>
              <el-col :span="4" style="margin-top: 4px;">
                <el-button type="text" @click="updateDate(scope.row)">修改</el-button>
              </el-col>
            </el-row>
            </template>
          </el-table-column>
          <el-table-column width="440" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="btn(scope.row)">{{ $route.meta.type === 'plan' ? '项目详情' : '套餐详情'}}</el-button>
              <el-button type="primary" size="small" @click="handleUseDetails(scope.row)">使用详情</el-button>
              <el-button type="" size="small" @click="openTransfer(scope.row)" v-if="scope.row.remainingNum > 0 && tcInfo.payStatus==1 && tcInfo.setMealType !== '06'">套餐转移</el-button>
              <el-button
                type="danger"
                size="small"
                @click="refund(scope.row)"
                v-if="tcInfo.payStatus==1 && !scope.row.blTransfer && scope.row.remainingNum > 0"
              >退费</el-button>
              <el-button v-if="scope.row.setMealType === '06'" type="primary" size="small" @click="getPlandetail(scope.row)">计划任务</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="order-module listchild">
        <h3 class="f14">订单信息</h3>
        <el-row>
          <el-col :span="7">
            <label>订单编号：</label>
            {{tcInfo.sn}}
          </el-col>
          <el-col :span="4">
            <label>订单状态：</label>
            <span class="type">{{tcInfo.payStatusChs}}</span>
          </el-col>
          <el-col :span="5">
            <label>下单时间：</label>
            {{tcInfo.createTime}}
          </el-col>
          <el-col :span="4">
            <label>提交人员：</label>
            {{tcInfo.creatorName}}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <label>原价金额：</label>
            <span>￥{{tcInfo.orderTotalPrice | formatToFinacial}}</span>
          </el-col>
          <el-col :span="4">
            <label>售价合计：</label>
            <span>￥{{tcInfo.orderTotalPriceDis | formatToFinacial}}</span>
          </el-col>
          <el-col :span="5">
            <label>已支付金额：</label>
            <span>￥{{(tcInfo.payStatus==2?'0':tcInfo.orderTotalPriceDis) | formatToFinacial}}</span>
            <!-- <el-button type="text" style="margin-left:10px;">支付流水</el-button> -->
          </el-col>
        </el-row>
        <el-row v-if="tcInfo.payStatus==2">
          <el-col :span="4">
            <label>剩余应付：</label>
            <span class="money">￥{{tcInfo.orderTotalPriceDis | formatToFinacial}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="order-module listchild " v-show="transferList.length">
        <h3 class="f14">转移信息</h3>
        <div v-for="item in transferList" :key="item.id" class="mt10">
          <el-row>
             <el-col :span="5">
              <label>套餐名称：</label>
              {{item.setMealName}}
            </el-col>
            <el-col :span="4">
              <label>转移时间：</label>
              {{item.createTime}}
            </el-col>
            <el-col :span="8">
              <label>操作人：</label>
              <span class="type">{{item.creatorName}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span v-if="item.transferTypeInt === 1"><label>被转移人姓名：</label>{{item.patientNew.name}}</span>
              <span v-else><label>原套餐持有人姓名：</label>{{item.patientOld.name}}</span>
            </el-col>
            <el-col :span="4">
              <label>出生日期：</label>
              {{formatData(item, 'birthday')}}
            </el-col>
            <el-col :span="3">
              <label>性别：</label>
              {{formatData(item, 'sexName')}}
            </el-col>

            <el-col :span="5">
              <label>患者档案号：</label>
              <span>{{formatData(item, 'patientNumber')}}</span>
            </el-col>
        </el-row>
        </div>
      </div>
      <div class="order-module listchild" v-if="tcInfo.setmealOrderRefund">
        <h3 class="f14">退费信息</h3>
        <el-row>
          <el-col :span="7">
            <label>退费状态</label>
            {{tcInfo.setmealOrderRefund.refundType === 4 ? '线下退费' : '全部退费'}}
          </el-col>
          <el-col :span="4">
            <label>退费金额：</label>
            <span class="type">{{tcInfo.setmealOrderRefund.totalFeeRefund}}</span>
          </el-col>
          <el-col :span="5">
            <label>退费原因：</label>
            {{tcInfo.setmealOrderRefund.refundReason}}
          </el-col>
          <el-col :span="4">
            <label>退费时间：</label>
            {{tcInfo.setmealOrderRefund.refundReason}}
          </el-col>
        </el-row>
      </div>
      <div style="margin-bottom:50px;" v-if="tcInfo.payStatus==2">
        <el-button @click="pay" type="primary" style="width:120px;">支付</el-button>
        <el-button @click="cancel" style="width:120px;">取消订单</el-button>
      </div>
    </div>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="payObj"
      @cancel="cancelLog"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
    ></paymethodstwo>
    <refund-dialog
      :dialogVisible.sync="refundVisible"
      :refundInfo="refundInfo"
      @establishCallback="establishCallback"
    ></refund-dialog>
    <transferdialog @get="getInfo" :visible.sync="transferVisible" :patient="tcInfo.patient" v-if="transferVisible"></transferdialog>
    <el-dialog title="核销退费"  :visible.sync="hexiaodialogVisible">
      <el-form :model="hexiaoRefundForm" label-width="100px" ref="hexiaoRefundForm" :rules="rules">
        <el-form-item label="退费金额" prop="totalFeeRefund">
          <el-input v-model="hexiaoRefundForm.totalFeeRefund" placeholder="退费金额"></el-input>
        </el-form-item>
        <el-form-item label="退费原因" prop="refundReason">
          <el-input v-model="hexiaoRefundForm.refundReason" placeholder="退费原因"></el-input>
        </el-form-item>
        <el-row>
          <el-col offset="4" :span="20">（保存成功后，保障计划内所有项目及任务将自动终止）</el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="hexiaodialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="hexiaoRefund">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/crm/store/packageapi'
import refundDialog from './refunddialog'
import transferdialog from '@/crm/page/packagesale/transferdialog'
import { everprint } from '@/util/common'
let pickerOptions = {
  disabledDate (time) {
    return time.getTime() < Date.now() - 8.64e7
  }
}
export default {
  data () {
    return {
      rules: {
        totalFeeRefund: [
          {required: true, message: '必填项', trigger: 'blur'}
        ],
        refundReason: [
          {required: true, message: '必填项', trigger: 'blur'},
          {max: 50, message: '最多可输入50个文字', trigger: 'blur'}
        ]
      },
      isShowRefundInfo: false,
      hexiaodialogVisible: false,
      hexiaoRefundForm: {},
      api,
      id: this.$route.params.combinationId,
      tcInfo: {},
      payVisible: false,
      refundVisible: false,
      transferVisible: false,
      backtrack: true,
      tableData: [],
      refunndObj: {}, // 新增退费信息，新的接口返回
      refundInfo: {
        patientId: '',
        setMealId: '',
        orderId: '',
        setMealName: '',
        name: '',
        birthday: '',
        sex: '',
        saleManName: '',
        createTime: ''
      },
      payObj: {
        patientid: '', // 患者id
        settlementId: '', // 结算单id
        settlementNo: '', // 结算单号
        unexefee: 0, // 还需支付
        exefee: 0, // 已收金额
        totalFee: 0, // 总额
        payType: '3', // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        paymethodArr: [], // 支付方式
        isValited: true, // 押金是false,费用为true
        payTradeLog: [], // 支付记录
        isDeposit: 0, // 是否押金
        saleChannel: 1
      },
      pickerOptions,
      transferList: []
    }
  },
  components: {
    refundDialog,
    transferdialog
  },
  computed: {
    orderId () {
      return this.$route.meta.thirdActiveIndex === '/card/order' || this.$route.meta.thirdActiveIndex === '/card/protectionplan/orderlist' || this.$route.path === '/card/protectionplan/orderlist' ? this.$route.params.id : this.id
    }
  },
  methods: {
    hexiaoRefund() {
      this.$refs.hexiaoRefundForm.validate((valid) => {
        if (valid) {
          api.offLineOrderRefund({orderId: this.$route.params.id, totalFeeRefund: this.refundInfo.totalFeeRefund, refundReason: this.refundInfo.refundReason}).then(res => {
            if (res && res.head && res.head.errCode === 0) {
              this.hexiaodialogVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatData (item, key) {
      return item.transferTypeInt === 1 ? item.patientNew[key] : item.patientOld[key]
    },
    openTransfer (data) {
      this.tcInfo.patient.data = data
      this.tcInfo.patient.data.orderId = this.orderId
      this.transferVisible = true
    },
    payPrint () {
      try {
        everprint('PACKAGE_CHARGE_PRINT', { orderId: this.id, id: this.id }, {
          preview: false,
          cb: _ => {
            console.log('打印完成')
          },
          lang: '01'
        })
      } catch (err) { }
    },
    establishCallback (val) {
      if (val) this.backtrack ? this.$router.go(-1) : this.$router.replace('/kanban/package/order')
    },
    btn (row) {
      if (this.$route.meta.thirdActiveIndex === '/card/order' || this.$route.path === '/card/protectionplan/orderlist' || this.$route.meta.thirdActiveIndex === '/card/protectionplan/orderlist') {
        if (this.$route.meta.thirdActiveIndex === '/card/protectionplan/orderlist') {
          this.$router.push({path: '/card/packageinfo/' + this.$route.params.id + '/' + row.setMealId, query: {type: 'plan'}})
        } else {
          this.$router.push({ path: '/card/packageinfo/' + this.$route.params.id + '/' + row.setMealId })
        }
      } else {
        if (this.$route.meta.thirdActiveIndex === '/kanban/guaranteeplanlist') {
          this.$router.push({ path: '/kanban/planpackageinfo/' + this.id + '/' + row.setMealId })
        } else {
          this.$router.push({ path: '/kanban/packageinfo/' + this.id + '/' + row.setMealId })
        }
      }
    },
    // 使用详情
    handleUseDetails (row) {
      if (this.$route.meta.thirdActiveIndex === '/card/order') {
        this.$router.push({ path: '/card/usedetails/' + this.$route.params.id + '/' + row.setMealId })
      } else if (this.$route.meta.thirdActiveIndex === '/card/protectionplan/orderlist') {
        this.$router.push({path: '/card/planusedetails/' + this.$route.params.id + '/' + row.setMealId})
      } else {
        if (this.$route.meta.thirdActiveIndex === '/kanban/guaranteeplanlist') {
          this.$router.push({ path: '/kanban/planusedetails/' + this.id + '/' + row.setMealId })
        } else {
          this.$router.push({ path: '/kanban/usedetails/' + this.id + '/' + row.setMealId })
        }
      }
    },
    getInfo () {
      api.detailsList({ id: this.orderId }).then(result => {
        this.tcInfo = result.data.resultList[0]
        this.tableData = result.data.resultList
      })
      api.getTransferByOrderId({ orderId: this.orderId }).then(result => {
        this.transferList = result.data || []
      })
    },
    cancel (row) {
      let _this = this
      this.$confirm('确定是要取消此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.changeStatus({ id: this.$route.params.id, payStatus: 4 }).then(result => {
          if (result.head.errCode === 0) {
            this.$messageTips(this, 'success', '取消成功')
            _this.establishCallback(true)
          }
        })
      })
    },
    updateDate (row) {
      if (!row.limitUseDate) {
        this.$messageTips(this, 'warning', '使用期限不能为空')
        return
      }
      let params = {
        orderId: row.id,
        setMealId: row.setMealId,
        limitUseDate: row.limitUseDate
      }
      api.setmealOrderUpdateLimitUseDate(params).then(res => {
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '修改成功')
          this.getInfo()
        } else {

        }
      })
    },
    async refund (row) {
      this.refundInfo.orderId = row.id
      this.refundInfo.setMealId = row.setMealId
      this.refundInfo.setMealName = row.setMealName
      this.refundInfo.name = row.patient.name
      this.refundInfo.birthday = row.patient.birthday
      this.refundInfo.sex = row.patient.sex
      this.refundInfo.saleManName = row.saleManName
      this.refundInfo.createTime = row.createTime
      this.refundInfo.patientId = row.patient.id
      this.refundInfo.saleChannel = row.saleChannel
      this.refundInfo.totalFeeRefund = row.totalFeeRefund
      this.refundInfo.refundReason = row.refundReason
      try {
        let isUse = await api.checkOrderIsUse({orderId: this.orderId, setMealId: row.setMealId})
        if (isUse.data) {
          this.hexiaodialogVisible = true
        } else {
          this.refundVisible = true
        }
      } catch (error) {
        console.log(error)
      }
    },
    async pay (row) {
      let order = await api.orderPay({ id: this.id || this.orderId })
      let settlement = await api.oneStepSettle(order.data)
      this.curId = this.orderId || this.orderId
      // 患者id
      this.payObj.patientid = order.data.patientId
      // 结算单id
      this.payObj.id = settlement.data.settlementBillId
      // 结算单号
      this.payObj.settleCode = settlement.data.settlementBillCode
      // 还需支付
      this.payObj.unexefee = this.tcInfo.orderTotalPriceDis
      // 已收金额
      this.payObj.exefee = 0
      // 总额
      this.payObj.totalFee = this.tcInfo.orderTotalPriceDis
      this.payVisible = true
    },
    // 关闭弹窗
    cancelLog () {
      this.payVisible = false
    },
    // 支付成功回掉
    payStatus () {
      api.changeStatus({ id: this.curId, payStatus: 1 }).then(result => {
        if (result.head.errCode === 0) {
          this.payVisible = false
          this.getInfo()
          this.payPrint()
          this.$messageTips(this, 'success', '支付成功')
        }
      }) // 支付成功之后修改订单的支付状态
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    getPlandetail (val) {
      if (this.$route.meta.thirdActiveIndex === '/card/order') {
        this.$router.push({
          path: '/card/plandetails/' + val.patient.id,
          query: {
            instanceId: this.$route.params.id + val.setMealId
          }
        })
      } else if (this.$route.meta.thirdActiveIndex === '/card/protectionplan/orderlist') {
        this.$router.push({
          path: '/card/protectplandetails/' + val.patient.id,
          query: {
            instanceId: this.$route.params.id + val.setMealId,
            planId: val.setMealId,
            orderId: this.$route.params.id
          }
        })
      } else {
        this.$router.push({
          path: '/kanban/package/plandetails/' + val.patient.id,
          query: {
            instanceId: this.id + val.setMealId,
            planId: val.setMealId,
            orderId: this.$route.params.combinationId
          }
        })
      }
    }
  },
  created () {
    this.getInfo()
  },
  watch: {
    '$route.query': {
      handler (val) {
        if (val.isBacktrack) {
          this.backtrack = false
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.order-module {
  font-size: 14px;
  h3 {
    padding-left: 10px;
    border-left: 3px solid #1c7bef;
  }
  .el-col {
    label {
      color: #999999;
    }
    .money {
      color: #ff9700;
    }
  }
  .el-table {
    margin-bottom: 15px;
  }
  &.listchild {
    .el-col {
      margin-bottom: 15px;
    }
    border: none;
    margin-bottom: 10px;
  }
  padding-bottom: 15px;
  border-bottom: 1px solid #eeeeee;
}
.date-col {
  position: relative;
  margin-top: -8px;
}
</style>

