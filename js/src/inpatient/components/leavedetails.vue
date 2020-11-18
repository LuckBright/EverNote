<template>
  <el-dialog
  title="出院登记"
  :visible.sync="dialogVisible"
  append-to-body
  :close-on-click-modal='false'
  width="90%"
  class="ipatient-leavedetail">
  <leavedetails ref='leavedetails' @close='close'></leavedetails>
</el-dialog>
</template>
<script>
import leavedetails from '@/adt/page/leavedetails.vue'
export default {
  data () {
    return {
      dialogVisible: false
    }
  },
  created () {

  },
  watch: {

  },
  methods: {
    open(row) {
      this.dialogVisible = true
      this.$nextTick(_ => {
        this.$refs.leavedetails.forminPatient(row)
      })
    },
    close() {
      this.dialogVisible = false
    }
  },
  components: {
    leavedetails
  },
}
</script>
<style scoped lang='scss'>
.ipatient-leavedetail{
  /deep/ .el-dialog{
    margin-top: 40px!important;
  }
  /deep/ .register{
    width:95%;
    overflow: hidden;
  }
  /deep/ .el-date-editor {
    width: 100%!important;
    }
}
</style>
