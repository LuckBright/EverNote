<template>
    <el-dialog
    :visible.sync="visible"
    class="ui_dialog_01 spe new-create"
    width="800px">
    <template slot="title">
    </template>
    <newcreate @closeDialog="closeDialog" @reload="reload" :isOpen="visible" :isPerson="isPerson"></newcreate>
    </el-dialog>
</template>
<script>
import Newcreate from './newcreate'
export default {
  props: ['isPerson'],
  data () {
    return {
      visible: false
    }
  },
  methods: {
    open (val) {
      this.visible = true
    },
    close () {
      this.visible = false
    },
    closeDialog () {
      this.close()
    },
    reload () {
      this.close()
      this.$emit('reload')
    }
  },
  components: {
    Newcreate
  }
}
</script>
<style lang="less" scoped>
.new-create.ui_dialog_02{
  /deep/ .el-dialog{
    .el-dialog__body{padding:0px;}
    .el-dialog__header{padding:0px;}
  }
}
</style>

