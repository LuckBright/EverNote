import {
  posPreRefund,
  posPayRollback,
  posRefund,
  posGetResult,
  posPostRefund
} from '@/rcm/store/outpatient/outpatient'
export default {
  data () {
    return {
      posTimer: null
    }
  },
  methods: {
    seeHavePos () {
      let posObj = this.obj.refundReceiptFlows.find(item => item.paymethod === 12) || false
      if (posObj) {
        this.posRefund(posObj)
      } else {
        return false
      }
    },
    async posRefund (data) {
      let posDataInfo = await posPreRefund(data)
      let info = ''
      if (posDataInfo.data && posDataInfo.data.todayRollBack.length > 0) {
        info = await posPayRollback({systraceNo: data.traceNo})
      } else if (posDataInfo.data && posDataInfo.data.yestodayRefund.length > 0) {
        info = await posRefund()
      }
      if (info) {
        this.queryPosType()
      }
    },
    queryPosType () {
      this.posTimer = window.setTimeout(_ => {
        this.posTimer = null
        posGetResult({isReturn: true}).then(rs => {
          if (rs.head.errCode === 0 && rs.data) {
            if (rs.data.code === '-1') {
              this.$messageTips(this, 'error', rs.data.message)
              this.payLoading = false
            }
            if (rs.data.code === '0') {
              posPostRefund(rs.data).then(rs => {
                if (rs.head.errCode === 0) {
                  this.payLoading = false
                  this.$messageTips(this, 'success', '支付成功')
                  this.$emit('getData', true)
                  this.$emit('paymentSuccess')
                }
              })
            }
          } else {
            this.queryPosType()
          }
        }, rj => {
          this.queryPosType()
        })
      }, 2000)
    },
  }
}
