<template>
  <div>
    <el-dialog
      :title="$route.meta.type === 'plan' ? '保障计划退费' : '套餐退费'"
      :visible.sync="v"
      width="80%"
      class="order ui_dialog_02 spe"
      :close-on-click-modal="false"
      v-loading="loading">
      <div class="scoll">
        <el-row class="refund-row">
          <el-col :span="4">
            <label>套餐：</label>
            {{refundInfo.setMealName}}
          </el-col>
          <el-col :span="4">
            <label>姓名：</label>
            {{refundInfo.name}}
          </el-col>
          <el-col :span="4">
            <label>生日：</label>
            {{refundInfo.birthday}}
          </el-col>
          <el-col :span="4">
            <label>性别：</label>
            <sys-value type="GBT.2261.1" :code="refundInfo.sex"></sys-value>
          </el-col>
          <el-col :span="4">
            <label>销售人：</label>
            {{refundInfo.saleManName}}
          </el-col>
          <el-col :span="4">
            <label>下单时间：</label>
            {{refundInfo.createTime}}
          </el-col>
          <el-col :span="4">
            <label>销售渠道：</label>
            {{refundInfo.saleChannel == 1 ? '院内销售' : '商城销售' }}
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :selectable="checkSelectable" width="55"></el-table-column>
          <el-table-column prop="setMealName" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.isUse==1" class="color1">已用</span>
              <span v-else-if="scope.row.isUse==0" class="color2">未用</span>
              <span v-else-if="scope.row.isUse==-2" class="color2">已转移</span>
              <span v-else class="color3">已退</span>
            </template>
          </el-table-column>
          <el-table-column prop="setMealCatalogName" width="205" align="center" label="项目类型"></el-table-column>
          <el-table-column prop="serviceName" align="center" width="205" label="项目名称"></el-table-column>
          <el-table-column prop="itemNum" label="数量"></el-table-column>
          <el-table-column prop="totalPrice" align="center" width="155" label="原价">
            <template slot-scope="scope">{{scope.row.totalPrice | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop align="center" width="155" label="售价">
            <template slot-scope="scope">{{scope.row.totalPriceDis | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column prop="discontinue" label="停用">
            <template slot-scope="scope">{{scope.row.discontinue==1?'是':'否'}}</template>
          </el-table-column>
        </el-table>
        <el-row style="margin-bottom:5px;" class="refund-row">
          <el-col :span="8">
            <label>选中项目售价合计：</label>
            ¥{{info.money1 | formatToFinacial}}
          </el-col>
          <el-col :span="8">
            <label>选中项目原价合计：</label>
            ¥{{info.money2 | formatToFinacial}}
          </el-col>
          <el-col :span="8">
            <label>套餐总额：</label>
            ¥{{info.money3 | formatToFinacial}}
          </el-col>
          <el-col :span="8">
            <label>已用项目原价合计：</label>
            ¥{{info.money4 | formatToFinacial}}
          </el-col>
          <el-col :span="8">
            <label>已退项目金额：</label>
            ¥{{info.money5 | formatToFinacial}}
          </el-col>
        </el-row>
        <el-form ref="form" label-width="100px" class="refund-form">
          <el-form-item label="退款原因" class="content">
            <el-input v-model="info.reason" :maxlength="16"></el-input>
          </el-form-item>
          <el-form-item label="退款金额" class="only">
            <span style="color:#FF9C00;">¥ {{refundFee | formatToFinacial}}</span>
            <!-- {{radio}} -->
            <el-button type="text" style="margin:0 10px;" @click="detailBtn">应退计算详情</el-button>
            <el-radio v-model="radio" label="1">整单退</el-radio>
            <el-radio v-model="radio" label="2" v-if="$route.meta.type!=='plan'">部分退</el-radio>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <p class="twinkling" v-if="payFeeIsPlus">应退金额为负数! 请收取对应金额</p>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="emitFun">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="refund-dialog"
      title="应退计算详情"
      width="30%"
      :close-on-click-modal="false"
      :visible.sync="visible"
    >
      <span class="detail-log">
        <el-row>
          <el-col :span="24" style="font-size:16px;" v-if="dialogInfo.type == 2 || dialogInfo.type == 1">
            <label>退费方式：</label>
            {{dialogInfo.type == 1 ? '整单退' : '部分退'}}
          </el-col>
        </el-row>
        <el-row v-if="dialogInfo.type == 1">
          <el-col :span="12">
            <label>套餐总额：</label>
          </el-col>
          <el-col :span="12" style="text-align: right;">¥{{dialogInfo.money1 | formatToFinacial}}</el-col>
        </el-row>
        <el-row v-if="dialogInfo.type == 1">
          <el-col :span="12">
            <label>已用项目原价合计：</label>
          </el-col>
          <el-col :span="12" style="text-align: right;">¥{{dialogInfo.money2 | formatToFinacial}}</el-col>
        </el-row>
        <el-row v-if="dialogInfo.type == 1">
          <el-col :span="12">
            <label>已用项目金额合计：</label>
          </el-col>
          <el-col :span="12" style="text-align: right;">¥{{dialogInfo.money3 | formatToFinacial}}</el-col>
        </el-row>
        <el-row v-if="dialogInfo.type == 2">
          <el-col :span="12">
            <label>选中项目售价合计：</label>
          </el-col>
          <el-col :span="12" style="text-align: right;">¥{{dialogInfo.money5 | formatToFinacial}}</el-col>
        </el-row>
        <el-row class="row-border-top" v-if="dialogInfo.type == 2 || dialogInfo.type == 1">
          <el-col :span="12">
            <label>应退金额：</label>
          </el-col>
          <el-col
            :span="12"
            style="text-align: right;color:#FF9C00;"
          >¥{{refundFee | formatToFinacial}}</el-col>
        </el-row>
        <!-- <el-row v-if="dialogInfo.type==3">
          <el-col :span="24">
            <el-input
              placeholder="请输入授权密码"
              type="password"
              v-model="dialogInfo.password"
              :maxlength="6"
            ></el-input>
          </el-col>
        </el-row> -->
      </span>
      <!-- <span slot="footer" class="dialog-footer" v-if="dialogInfo.type==3">
        <el-button type="primary" @click="submitPassword">提 交</el-button>
      </span> -->
    </el-dialog>
    <paymethodstwo
      :dialogVisible.sync="payVisible"
      :obj="payObj"
      @cancel="cancel1"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
    ></paymethodstwo>
    <!-- 授权弹窗 -->
    <authorize-log
      ref="authorizelog"
      width="500px"
      typeCode="meal_refund_auth"
      @confirmCallback="authorizeconfirm"
      @cancleAuth="handleCloseAuth"
      :patientId="patientId"
      :visitNumber="visitNumber"
    ></authorize-log>
  </div>
</template>
<script>
import api from '../../store/packageapi.js'
import { everprint } from '@/util/common'
import prescription from '@/inpatient/components/medical.orders/issued.orders'
import AuthorizeLog from '@/rcm/page/outpatientSettlement/authorize.log.vue'
import authApi from '@/rcm/store/outpatient/auth.manage.api.js'

export default {
  props: ['dialogVisible', 'refundInfo'],
  components: {
    prescription, // 开医嘱组件
    AuthorizeLog
  },
  data () {
    return {
      api,
      visible: false,
      dialogInfo: {
        title: '应退计算详情',
        type: 2,
        money1: '', // 套餐总额
        money2: '', // 已用项目原价合计
        money3: '', // 已用项目金额合计
        money4: '', // 应退金额
        money5: '', // 选中项目售价合计
        password: '' // 授权码
      },
      info: {
        money1: '', // 选中项目售价合计
        money2: '', // 选中项目原价合计
        money3: '', // 套餐总额
        money4: '', // 已用项目原价合计
        money5: '', // 已退项目金额
        money6: '', // 未用项目原价合计
        reason: ''
      },
      refundAuthorize: '',
      useLen: 0, // 未用项目的个数
      radio: '1', // 默认是1
      refundFee: 0,
      tableData: [],
      selectArr: [],
      payVisible: false,
      loading: false,
      payFeeIsPlus: false,
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
        isRefund: true
      },
      patientId: '',
      visitNumber: '',
      authorizeInfo: []
    }
  },
  created () {
    // api.getByCode({ code: 'refund_authorize' }).then(result => {
    //   this.refundAuthorize = result.data
    // })
    // 获取权限配置
    this.getAuthList()
  },
  watch: {
    'dialogVisible': {
      handler: function (val, oldval) {
        if (val) {
          // 打开赋默认值
          this.radio = '1'
          this.getInfo()
        } else {
          this.clearInfo()
        }
      }
    },
    'radio': {
      handler: function (val, oldval) {
        this.dialogInfo.type = val
        if (val === '2') {
          this.refundFee = Number(this.info.money1).toFixed(2)
          this.dialogInfo.type = '3'
          this.handleAuthFun()
          // this.$refs.authorizelog.visible = true
          // this.visible = true
        } else {
          this.selectedAllData(true)
          if (this.selectArr.length > 0) {
            this.refundFee = (this.info.money3 - this.info.money4 - this.info.money5 - this.info.money6 + this.info.money2).toFixed(2)
          } else {
            this.refundFee = 0
          }
        }
        if (this.refundFee < 0) {
          this.payFeeIsPlus = true
        } else {
          this.payFeeIsPlus = false
        }
      }
    },
    // 'visible': {
    //   handler: function (val, oldval) {
    //     // if (!val) {
    //     //   if (this.dialogInfo.password !== this.refundAuthorize) {
    //     //     this.radio = '1'
    //     //   } else {
    //     //     // 如果
    //     //     this.selectedAllData(false)
    //     //   }
    //     //   this.dialogInfo.password = ''
    //     // }
    //   }
    // }
  },
  computed: {
    v: {
      get () {
        return this.dialogVisible
      },
      set (val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  methods: {
    // 授权触发入口方法
    handleAuthFun () {
      let info = this.authorizeInfo.find(item => item.code === 'meal_refund_auth')
      if (info && info.status) {
        this.$refs.authorizelog.visible = true
      } else {
        this.selectedAllData(false)
      }
    },
    // 获取授权配置
    getAuthList () {
      authApi.authList().then(rs => {
        if (!rs.head.errCode) {
          this.authorizeInfo = rs.data
        } else {
          this.$messageTips(this, 'error', '授权列表获取失败')
        }
      })
    },
    // 授权的回调函数
    authorizeconfirm (callVal) {
      this.selectedAllData(false)
    },
    // 关闭授权弹窗改回状态值
    handleCloseAuth () {
      this.radio = '1'
    },
    getInfo () {
      this.loading = true
      api.getOrderDetail(this.refundInfo).then(result => {
        this.tableData = result.data
        this.$nextTick(_ => {
          this.selectedAllData()
          this.loading = false
        })
        this.initMoney(result.data)
      })
    },
    initMoney (data) {
      let money1 = 0 // 总额度
      let money2 = 0 // 已用项目原价合计
      let money3 = 0 // 已退项目金额
      let money4 = 0 // 已用项目售价合计
      let money5 = 0 // 未用项目原价合计
      this.useLen = 0
      data.forEach(item => {
        money1 += item.totalPriceDis
        if (item.isUse === 1) { // 已用
          money2 += item.totalPrice
          money4 += item.totalPriceDis
        } else if (item.isUse === -1) { // 已退
          money3 += item.totalPriceDis
        } else if (item.isUse === 0) {
          this.useLen += 1
          money5 += item.totalPrice
        }
      })
      this.info.money3 = money1
      this.info.money4 = money2
      this.info.money5 = money3
      this.info.money6 = money5
      this.dialogInfo.money1 = money1
      this.dialogInfo.money2 = money2
      this.dialogInfo.money3 = money4
    },
    handleSelectionChange (data) {
      this.selectArr = data
      let money1 = 0
      let money2 = 0
      if (data.length === 0) {
        this.info.money1 = 0
        this.info.money2 = 0
      } else {
        data.forEach(item => {
          money1 += item.totalPriceDis
          money2 += item.totalPrice
        })
        this.info.money1 = money1
        this.info.money2 = money2
        this.dialogInfo.money5 = money1
      }
      if (this.radio === '2') {
        this.refundFee = Number(this.info.money1).toFixed(2)
      } else {
        this.refundFee = (this.info.money3 - this.info.money4 - this.info.money5 - this.info.money6 + this.info.money2).toFixed(2)
      }
      if (this.refundFee < 0) {
        this.payFeeIsPlus = true
      } else {
        this.payFeeIsPlus = false
      }
    },
    checkSelectable (row) {
      return (row.isUse === 0) && (this.radio === '2')
    },
    detailBtn () {
      this.dialogInfo.type = this.radio
      this.visible = true
    },
    cancel () {
      this.$emit('update:dialogVisible', false)
    },
    emitFun () {
      if (this.selectArr.length === 0) {
        this.$messageTips(this, 'error', '请选择退款项目')
        return
      }
      if (!this.info.reason) {
        this.$messageTips(this, 'error', '退款原因不能为空')
        return
      }
      if (this.radio === '2' && this.selectArr.length === this.useLen) {
        this.$confirm('当前选择了全部未用项目，建议选择“整单退”退费方式', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '返回',
          type: 'warning'
        }).then(() => {
          this.submitInfo()
        })
      } else {
        this.submitInfo()
      }
    },
    submitPassword () {
      if (this.dialogInfo.password === this.refundAuthorize) {
        this.visible = false
        // this.submitInfo()
      } else {
        this.$messageTips(this, 'error', '授权密码不正确')
      }
    },
    submitInfo () {
      let params = {
        totalFeeRefund: this.refundFee,
        refundReason: this.info.reason,
        details: this.selectArr
      }
      api.orderRefund(params).then(result => {
        if (Number(this.refundInfo.saleChannel) === 1) {
          this.oneStepSettle(result.data)
        } else {
          this.$emit('update:dialogVisible', false)
        }
      })
    },
    oneStepSettle (data) { // 一站式生成结算单，初始化支付数据
      data.orderNo = ''
      api.oneStepSettle(data).then(result => {
        // 患者id
        this.payObj.patientid = this.refundInfo.patientId
        // 结算单id
        this.payObj.id = result.data.settlementBillId
        // 结算单号
        this.payObj.settleCode = result.data.settlementBillCode
        // 还需支付
        this.payObj.unexefee = this.refundFee
        // 已收金额
        this.payObj.exefee = 0
        // 总额
        this.payObj.totalFee = this.refundFee
        this.payVisible = true
        this.$emit('update:dialogVisible', false)
      })
    },
    cancel1 () { // 关闭弹窗
      this.payVisible = false
      this.$emit('establishCallback', true)
    },
    payStatus () { // 支付成功回掉
      let params = []
      this.selectArr.forEach(item => {
        params.push(item.id)
      })
      api.refundDetail({ ids: params }).then(result => {
        if (result.head.errCode === 0) {
          this.$emit('establishCallback', true)
          this.refundPrint(result.data)
          this.payVisible = false
          this.$messageTips(this, 'success', '退费成功')
        }
      }) // 支付成功之后修改订单的支付状态
    },
    refundPrint (data) {
      try {
        everprint('PACKAGE_REFUND_RECEIPT_SUMMARY',
          {
            orderId: data.orderId,
            refundTime: data.time,
            setMealId: data.setMealId,
            patientId: this.refundInfo.patientId
          },
          {
            preview: false,
            cb: _ => {
              console.log('打印完成')
            },
            lang: '01'
          }
        )
      } catch (err) { }
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    selectedAllData (selected) {
      this.tableData.filter(item => { return item.isUse === 0 }).forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, selected)
      })
    },
    clearInfo () {
      this.refundFee = ''
      this.info.money1 = ''
      this.info.money2 = ''
      this.info.money3 = ''
      this.info.money4 = ''
      this.info.money5 = ''
      this.info.money6 = ''
      this.info.reason = ''
      this.dialogInfo.type = '2'
      this.dialogInfo.money1 = ''
      this.dialogInfo.money2 = ''
      this.dialogInfo.money3 = ''
      this.dialogInfo.money4 = ''
      this.dialogInfo.money5 = ''
    }
  }
}
</script>
<style lang="less" scoped>
label {
  color: #666666;
}
.el-table {
  margin: 0 0 20px 0;
}
.only .el-input {
  width: 200px;
}
.refund-form /deep/ .el-form-item__label {
  color: #666666 !important;
}
.refund-form /deep/ .content label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.dialog-footer p {
  position: relative;
  top: -5px;
  display: inline-block;
  float: left;
  color: red;
  font-size: 16px;
  font-weight: 500;
}
.ui_dialog_02 /deep/ .el-dialog__footer {
  border-top: 1px solid #cccccc;
}
.color1 {
  color: #1c7bef;
}
.color2 {
  color: #5cbc2c;
}
.color3 {
  color: red;
}
.refund-row .el-col {
  min-width: 205px;
  margin-bottom: 15px;
}
.detail-log .el-row {
  margin-bottom: 15px;
}
.refund-dialog /deep/ .el-dialog__body {
  padding: 30px 15%;
}
.refund-dialog /deep/ .el-dialog__header {
  border-bottom: 1px solid #eeeeee;
}
.refund-dialog /deep/ .row-border-top {
  border-top: 1px solid #eeeeee;
  padding-top: 30px;
}
.refund-dialog /deep/ .el-dialog__footer {
  text-align: center !important;
}
</style>
