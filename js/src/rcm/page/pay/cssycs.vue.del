<template>
  <div class="laytou_inner">
    <el-form :inline="true" label-width="100px" :model="obj">
      <el-form-item label="源订单ID">
        <el-input v-model="obj.orderId"></el-input>
        <span style="color:red;">{{payType}}</span>
      </el-form-item>
      <el-form-item label="退货源订单">
        <el-input v-model="obj.sourceOrderId"></el-input>
      </el-form-item>
      <el-form-item label="订单来源">
        <el-input v-model="obj.orderFrom"></el-input>
      </el-form-item>
      <el-form-item label="会员ID">
        <el-input v-model="obj.memberId"></el-input>
      </el-form-item>
      <el-form-item label="会员名称">
        <el-input v-model="obj.memberName"></el-input>
      </el-form-item>
      <el-form-item label="回调路径">
        <el-input v-model="obj.callbackUrl"></el-input>
      </el-form-item>
      <el-form-item label="回调扩展信息">
        <el-input v-model="obj.callbackContext"></el-input>
      </el-form-item>
      <el-form-item label="租户ID">
        <el-input v-model="obj.clinicId"></el-input>
      </el-form-item>
      <el-form-item label="机构ID">
        <el-input v-model="obj.tenantId"></el-input>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="itemId"
        label="商品ID">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemId"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemCode"
        label="商品编码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemCode"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemClass"
        label="商品分类编码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemClass"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemClassName"
        label="商品分类名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemClassName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemName"
        label="商品名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemPrice"
        label="商品价格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.itemPrice"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="数量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.quantity"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderDetailId"
        width="190"
        label="源订单明细ID">
        <template slot-scope="scope">
          <el-input v-model="scope.row.orderDetailId"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="sourceOrderDetailId"
        width="190"
        label="退货源订单明细ID">
        <template slot-scope="scope">
          <el-input v-model="scope.row.sourceOrderDetailId"></el-input>
        </template>
      </el-table-column>

    </el-table>
    <el-button @click="pay">结算</el-button>
    <el-button @click="refund">退费</el-button>
    <el-button @click="add">增加商品</el-button>
    <el-button @click="emit">减少商品</el-button>
    <el-button @click="aaa">刷新源订单id</el-button>
    <supermarket-payment-layer 
    :visibile="paydialogVisible" 
    :payInfo='aobj'
    @payStatus="payStatus"
    @cancel="cancel"
    @refundSuccess="refundSuccess"
    ></supermarket-payment-layer>
  </div>
</template>
<script>
import api from '@/rcm/store/outpatient/supermarket.payment.api.js'
import supermarketPaymentLayer from './supermarket.payment.layer'
export default {
  data () {
    return {
      api,
      isSureLoading: false,
      paydialogVisible: false,
      layershow: false,
      obj: {
        'orderId': '',
        'orderFrom': 1,
        'memberId': '',
        'memberName': '',
        'callbackUrl': '1231231231231sdasdfafd',
        'callbackContext': '',
        sourceOrderId: ''
      },
      tableData: [],
      checkArr: [],
      payType: '',
      payLayerType: '',
      aobj: {
        // 换号字段（新就诊流水号）
        huanhaoOrderId: '',
        // 挂号充值增值金额
        givedMoneyGH: 0,
        // 是否需要关闭前回调(true需要弹窗关闭前回调)
        iscallback: true,
        // 优惠金额（退款展示）
        totalDiscount: 0,
        outpatientrefund: false,
        // 支付历史
        refundReceiptFlows: [],
        // 外层loading
        loading: false,
        // 患者id
        patientid: '',
        // 结算单id
        id: '',
        // 结算单号
        settleCode: '',
        // 还需支付
        unexefee: 0,
        // 已收金额
        exefee: 0,
        // 总额
        totalFee: 0,
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的6应付管理商保结算的个人退款
        payType: '2',
        // 支付方式
        paymethodArr: [],
        // 是否押金(押金传1)
        isDeposit: 0,
        // 是否退费(退费传true)
        isRefund: false,
        // 是否走反算流程默认true走反算流程
        backCalculation: true,
        payObj: {
          paymethod: '8',
          remark: '',
          flowfee: '',
          auth_code: '', // 授权码
          qrfee: '' // pos机的金额
        }
      }
    }
  },
  components: {
    supermarketPaymentLayer
  },
  methods: {
    aaa () {
      this.obj.orderId = new Date().getTime()
      this.obj.sourceOrderId = this.obj.orderId
      this.payType = ''
    },
    handleSelectionChange (arr) {
      this.checkArr = arr
    },
    add () {
      let orderId = new Date().getTime() + '>' + (this.tableData.length + 1)
      this.tableData.push({
        'itemId': '001',
        'itemCode': 'code001',
        'itemClass': 11111,
        'itemClassName': 'classname002',
        'itemName': '超市收银商品1',
        'itemPrice': '4.34',
        'itemSpec': '',
        'itemUnit': '',
        'quantity': '4',
        'orderDetailId': orderId,
        sourceOrderDetailId: orderId
      })
    },
    emit () {
      this.tableData.pop()
    },
    pay () {
      let params = JSON.parse(JSON.stringify(this.obj))
      params.detailVoList = this.tableData
      api.payStart(params).then(rs => {
        console.log(rs.data)
        Object.assign(this.aobj, rs.data)
        this.aobj.totalFee = rs.data.totalFee
        this.aobj.exefee = 0
        this.paydialogVisible = true
      })
    },
    refund () {
      let params = JSON.parse(JSON.stringify(this.obj))
      params.orderId = this.obj.orderId = 'tk' + new Date().getTime()
      params.detailVoList = this.checkArr
      params.detailVoList.forEach(item => {
        item.orderDetailId = 'tk' + item.sourceOrderDetailId
      })
      api.payRefund(params).then(rs => {
        console.log(rs.data)
        Object.assign(this.aobj, rs.data)
        this.paydialogVisible = true
      })
    },
    // 关闭弹窗
    cancel () {
      this.paydialogVisible = false
      this.payType = '生成结算单，未付款'
    },
    // 支付成功回掉
    payStatus () { // 支付成功判断是否完全金额，没有支付完则再次调支付
      console.log('支付成功')
      this.payType = '支付成功'
      // this.paydialogVisible = false
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    refundSuccess () {
      console.log('退款成功')
      this.payType = '退款成功'
      this.paydialogVisible = false
    },
    closedialog () { // 关闭支付弹窗
      this.paydialogVisible = false
      this.payType = '生成结算单，未付款'
    },
    getData () {

    }
  },
  created () {
    this.obj.orderId = new Date().getTime()
    this.obj.sourceOrderId = this.obj.orderId
    this.obj.clinicId = window.localStorage.getItem('CLINICID')
    this.obj.tenantId = window.localStorage.getItem('TENANTID')
  }
}
</script>
