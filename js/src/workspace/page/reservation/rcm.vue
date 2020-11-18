<template>
  <div>
    <el-dialog class="ui_dialog_02 sob_rcm_dialog" title="支付" :visible.sync="dialogVisible" :close-on-click-modal="false" :modal-append-to-body="false" v-if="settlementId && settlementId !== '-1'">
      <pay :settlement-id="settlementId" :refund="refund" :key="settlementId" @paysuccess="paySuccess" @payerror="payError" :type='1'></pay>
    </el-dialog>
  </div>

</template>
<script>
import pay from '@/rcm/page/register/register'

export default {
  props: ['settlementId', 'visible', 'refund'], // refund true 退号
  computed: {
    dialogVisible: {
      set (val) {
        this.$emit('update:visible', val)
      },
      get () {
        return this.visible
      }
    }
  },
  components: {
    pay
  },
  methods: {
    paySuccess () {
      this.dialogVisible = false
      // this.$notify.success('预约成功')
      this.$bus.$emit('yihu:appointPayed', this.settlementId)
    },
    payError () {
      console.log('payError')
    }
  }
}
</script>
<style scoped>
.ui_dialog_02.sob_rcm_dialog /deep/ .el-dialog {
  min-width: 1000px !important;
}
.ui_dialog_02.sob_rcm_dialog /deep/ .el-dialog__header {
  text-align: left !important;
}
.ui_dialog_02.sob_rcm_dialog /deep/ .el-dialog .el-dialog__body {
  padding: 0 30px 30px !important;
  max-height: 610px !important;
}
</style>

