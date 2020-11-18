// im 业务处理
import { ROLE_TYPE } from '../util/models'

export default {
  methods: {
    // 处理按钮点击事件
    handleTouchEvent (groupId) {
      if (this.roleType === ROLE_TYPE[1]) { // 患者端触发
        this.submitConsultAgain(groupId)
      }
    },
    // 再次发起问诊
    submitConsultAgain (groupId) {
      this.$store.dispatch('IM_COUNSELDETAIL', { groupId }).then(res => {
        if (res && res.data) {
          const ext = encodeURIComponent(JSON.stringify({
            count: 1,
            goodsName: '图文问诊',
            organId: res.data.info.orgId,
            price: res.data.info.price,
            serviceId: res.data.info.id,
            totalPrice: res.data.info.price
          }))
          this.$wx.miniProgram.navigateTo({ url: `/pages/commonSub/consult/main?ext=${ext}` })
        }
      })
    }
  }
}
