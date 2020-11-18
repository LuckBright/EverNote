<template>
  <div>
    <!-- {{queryObj.dischargeDatetime}} {{queryObj.totalAmountRefund}} -->
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      :rules="rules"
      ref="refundform"
      class="refundform"
      :label-width="'80px'"
    >
      <div></div>
    </ever-form2>
    <el-table :data="refundData" style="width: 100%" v-loading="refundLoading">
      <el-table-column prop="payName" label="支付方式"></el-table-column>
      <el-table-column prop="flowFee" label="金额"></el-table-column>
    </el-table>
    <div style="text-align:right">
      <el-button
        type="primary"
        size="small"
        @click="sureRufundFee"
        v-if="this.$route.query.ipStatus==2"
      >退款确认</el-button>
    </div>
    <paymethodstwo
      :dialogVisible.sync="paydialogVisible"
      :obj="obj"
      @cancel="cancel"
      @payStatus="payStatus"
      @refundstatus="refundStatus"
      @closedialog="closedialog"
    ></paymethodstwo>
  </div>
</template>
<script>
import {
  getDepositHistory,
  // dischargeFromHospital,
  payDepositInBack
} from '@/rcm/store/hospital/hospital'
let schema = [
  {
    label: '押金总额',
    name: 'totalAmountRefund',
    props: {
      placeholder: '输入押金总额',
      type: 'number',
      disabled: true
    },
    span: 4
  },
  {
    label: '退院时间',
    name: 'dischargeDatetime',
    comp: 'datePicker',
    props: {
      placeholder: '请选择退院日期',
      autoWidth: true,
      disabled: true
    },
    span: 5
  }
]

// queryObj.requestSwitch = true
export default {
  data () {
    let myValidator = {
      totalAmountRefund: (rules, value, callback) => {
        // console.log(this.totalDeposite, value)
        // 不填是undefined,填0是''
        if (value === '') {
          callback(new Error('押金总额不能为空'))
        } else if (Number(value) > this.totalDeposite) {
          callback(new Error('押金总额不能大于已交押金总额'))
        } else {
          callback()
        }
      }
    }
    let rules = {
      totalAmountRefund: [{
        required: true,
        validator: myValidator.totalAmountRefund,
        trigger: 'blur'
      }],
      dischargeDatetime: [{
        required: true,
        message: '退院时间不能为空',
        trigger: 'blur'
      }]
    }
    var queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.dischargeDatetime = new Date()
    return {
      refundData: [],
      refundLoading: false,
      querySchema: schema,
      queryObj: queryObj,
      rules: rules,
      totalDeposite: 0,
      paydialogVisible: false,
      obj: {
        // 是否需要关闭前回调(true需要弹窗关闭前回调)
        iscallback: false,
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
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的
        payType: '2',
        // 支付方式
        paymethodArr: [],
        // 是否押金(押金传1)
        isDeposit: 0,
        // 是否退费(退费传true)
        isRefund: true,
        // 是否走反算流程默认true走反算流程
        backCalculation: true
      }
    }
  },
  created () {
    this.getDeposit()
  },
  methods: {
    closedialog (done) {
      done()
    },
    // 关闭弹窗
    cancel () {
      this.paydialogVisible = false
    },
    // 支付成功回掉
    payStatus () {
      this.sureRufundBtn()
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    },
    sureRufundFee () {
      payDepositInBack({
        patientId: this.$route.query.patientId, // 患者id
        ipNo: this.$route.query.ipNo, // 住院号（住院流水号）
        fee: -Number(this.queryObj.totalAmountRefund)
      }).then(rs => {
        this.obj.patientid = this.$route.query.patientId
        this.obj.id = rs.data.ipSettlementId
        this.obj.settleCode = rs.data.settleCode
        this.obj.unexefee = Number(this.queryObj.totalAmountRefund)
        this.obj.totalFee = Number(this.queryObj.totalAmountRefund)
        this.paydialogVisible = true
      })
    },
    // async sureRufundBtn () {
    //   this.refundLoading = true
    //   this.$refs.refundform.$refs.form.validate(async (valid) => {
    //     if (valid) {
    //       try {
    //         let params = {
    //           patientId: this.$route.query.patientId, // 患者id
    //           popPayTradeLogIFrame: true,
    //           hospitalizedNumber: this.$route.query.ipNo, // 住院号（住院流水号）
    //           inpatientNumber: this.$route.query.inpatientNumber, // 住院病案号
    //           dischargeDatetime: this.$moment(this.queryObj.dischargeDatetime).format('YYYY-MM-DD HH:mm:ss'), // 退院时间
    //           totalAmountRefund: Number(this.queryObj.totalAmountRefund) // 退押金总额
    //         }
    //         let data = await dischargeFromHospital(params)
    //         if (data && data.data && data.data.result) {
    //           this.$router.replace({
    //             path: this.$route.path,
    //             query: { ...this.$route.query, ipStatus: 6 }
    //           })
    //         }
    //         this.refundLoading = false
    //       } catch (err) {
    //         this.refundLoading = false
    //       }
    //     } else {
    //       this.refundLoading = false
    //       return false
    //     }
    //   })
    // },
    async getDeposit () {
      this.refundLoading = true
      try {
        let params = {
          patientId: this.$route.query.patientId, // 患者id
          ipNo: this.$route.query.ipNo // 住院号
        }
        let data = await getDepositHistory(params)
        if (data && data.data) {
          this.refundData = data.data
          this.totalDeposite = data.data.reduce((sum, curr) => {
            sum += Number(curr.flowFee)
            return sum
          }, 0)
          this.queryObj.totalAmountRefund = this.totalDeposite + ''
        }
        this.refundLoading = false
      } catch (err) {
        this.refundLoading = false
      }
    }
  }
}
</script>
<style scoped>
.refundform /deep/ .el-form .el-button.el-button--default {
  display: none;
}
</style>

