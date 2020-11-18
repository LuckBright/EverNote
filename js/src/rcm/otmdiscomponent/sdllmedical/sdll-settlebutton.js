import {
  updatePersonAccount
} from '@/rcm/store/outpatient/outpatient'
export default {
  methods: {
    sdllPresettle () {
      this.handleSettleClick(true).then(res => {
        this.sdllPresettleVisible = true
      })
    },
    continueSettle (params) {
      updatePersonAccount(params).then(res => {
        if (Number(this.urlpath) === 0) { // 医保待结算页签
          this.gotoSettled()
        } else if (Number(this.urlpath) === 2) { // 已结算页签
          // 写在settlebutton里面
          this.normalRefund()
        }
      }).catch((err) => {
        console.log('err', err)
        this.$messageTips(this, 'success', '修改个人支付金额出错，请稍后再试！')
      })
    },
    // 待结算页面，医保预结算后，继续自费结算
    gotoSettled () {
      this.$router.push({
        path: '/rcm/reconstruct/settled',
        query: {
          settlementid: this.obj.id,
          showDetail: 0,
          visitNumber: this.obj.rootorderid,
          dptId: this.obj.orderDept,
          patientId: this.obj.patientid,
          time: Date.now()
        }
      })
    }
  }
}
