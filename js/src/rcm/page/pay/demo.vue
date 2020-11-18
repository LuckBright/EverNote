<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-21 17:00:36
 -->
<template>
    <div>
        <el-button type='primary' @click='paytwo'>支付方式2</el-button>
        <paymethodstwo :dialogVisible.sync='paydialogVisible' :obj='obj' @cancel='cancel' @payStatus='payStatus' @refundstatus='refundStatus' @closedialog='closedialog'></paymethodstwo>
    </div>
</template>
<script>
export default {
  data () {
    return {
      paydialogVisible: false,
      obj: {
        // 换号字段（新就诊流水号）
        huanhaoOrderId: '',
        // 挂号充值增值金额
        givedMoneyGH: 0,
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
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的6应付管理商保结算的个人退款
        payType: '2',
        // 支付方式
        paymethodArr: [],
        // 是否押金(押金传1)
        isDeposit: 0,
        // 是否退费(退费传true)
        isRefund: false,
        // 是否走反算流程默认true走反算流程
        backCalculation: true
      }
    }
  },
  methods: {
    closedialog (done) {
      done()
    },
    //   打开弹窗
    paytwo () {
      this.paydialogVisible = true
    },
    // 关闭弹窗
    cancel () {
      this.paydialogVisible = false
    },
    // 支付成功回掉
    payStatus () {
      console.log('支付成功')
    },
    // 作废成功回掉
    refundStatus () {
      console.log('作废成功')
    }
  }
}
</script>

